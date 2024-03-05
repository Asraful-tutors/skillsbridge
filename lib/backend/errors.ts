import { NextResponse } from "next/server";
import { ParseParams, ZodTypeAny } from "zod";

export function toResponse(error: BackendError | Error | unknown) {
	if (error instanceof BackendError) {
		return error.toResponse();
	}
	return NextResponse.json({ message: "Internal server error" }, { status: 500 })
}

export function toString(error: BackendError | Error | unknown) {
	if (error instanceof BackendError) {
		return error.getString();
	}
	return "Internal server error"
}

export function zodOrThrow<T extends ZodTypeAny>(zobj: T, data: unknown, params?: Partial<ParseParams & { status: number }>): ReturnType<T["parse"]> {

	const match = zobj.safeParse(data, params)
	if (!match.success) {
		if (match.error.issues.length > 1) {
			throw new PublicError(params?.status ?? 400, `Invalid parameters: ${match.error.issues.map(v => v.message).join(", ")}`)
		} else {
			throw new PublicError(params?.status ?? 400, match.error.issues[0].message)
		}
	}
	return match.data as ReturnType<T['parse']>;
}

/** Error invisible to users by default. Displays as internal server error */
export class BackendError extends Error {
	userVisible = false;
	status = -1;

	constructor(status: number, message: string, options?: ErrorOptions) {
		super(message, options)
		this.status = status;
		if (status < 300) {
			throw Error("Status of error cannot be less than 300")
		}
	}
	getString(): string {
		return "Internal server error"
	}
	toResponse(): NextResponse<{ message: string; }> {
		return NextResponse.json({ message: this.getString() }, { status: this.status })
	}
}

/** Error visible to users */
export class PublicError extends BackendError {

	override userVisible = true;
	publicMessage?: string;
	status = -1;

	constructor(status: number, message: string, options?: ErrorOptions)
	constructor(status: number, backendMessage: string, publicMessage: string, options?: ErrorOptions)
	constructor(status: number, message: string, arg3?: string | ErrorOptions, arg4?: ErrorOptions) {
		const options = typeof arg3 === 'string' ? arg4 : arg4 ?? arg3;
		const publicMessage = typeof arg3 === 'string' ? arg3 : undefined;
		super(status, message, options)
		this.status = status;
		this.publicMessage = publicMessage;
		if (status < 300) {
			throw Error("Status of error cannot be less than 300")
		}
	}
	override getString(): string {
		return this.publicMessage ?? this.message
	}
	override toResponse() {
		return NextResponse.json({ message: this.getString() }, { status: this.status })
	}
}


namespace Errors {

	class InvalidArgumentError extends PublicError { constructor(arg?: string) { super(400, arg ? `Invalid argument: ${arg}` : "Invalid argument") } }
	export function InvalidArgument(arg?: string) { return new InvalidArgumentError(arg) }

	class InvalidArgumentsError extends PublicError { constructor(args: string[]) { super(400, args.length ? `Invalid arguments: ${args.join(', ')}` : "Invalid arguments") } }
	export function InvalidArguments(...args: string[]) { return new InvalidArgumentsError(args) }

	class InvalidSessionError extends PublicError { constructor() { super(401, "Invalid session") } }
	export function InvalidSession() { return new InvalidSessionError() }

	class ForbiddenError extends PublicError { constructor() { super(403, "Forbidden") } }
	export function Forbidden() { return new ForbiddenError() }

	class NotFoundError extends PublicError { constructor(name?: string) { super(404, name ? `${name} not found` : "Not found") } }
	export function NotFound(name?: string) { return new NotFoundError(name) }

}

export default Errors;