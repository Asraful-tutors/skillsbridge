import { NextResponse } from "next/server";
import { ParseParams, ZodTypeAny } from "zod";

export function toResponse(error: Error | unknown) {
	if (error instanceof BackendError) {
		return error.toResponse();
	}
	return NextResponse.json({ message: "Internal server error" }, { status: 500 })
}

export function zodThrow<T extends ZodTypeAny>(zobj: T, data: unknown, params?: Partial<ParseParams & { status: number }>): ReturnType<T["parse"]> {

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
	toResponse(): NextResponse<{ message: string; }> {
		return NextResponse.json({ message: "Internal server error" }, { status: this.status })
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

	override toResponse() {
		return NextResponse.json({ message: this.publicMessage ?? this.message }, { status: this.status })
	}
}
