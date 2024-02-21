import { Prisma, PrismaClient } from "@prisma/client";
import { spinner, replaceLine, withSpinner } from "./std-utils";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;


type ModelName = Prisma.TypeMap<any>['meta']['modelProps']

type UpdateModel<T extends ModelName> = Parameters<typeof prisma[T]['update']>[0]['data']
type CreateModel<T extends ModelName> = Parameters<typeof prisma[T]['create']>[0]['data']
type CreatedModel<T extends ModelName> = Awaited<ReturnType<typeof prisma[T]['create']>>

interface IFactory<T extends ModelName> {
	values: CreateModel<T>[]
	name: T
}


export abstract class Factory<T extends ModelName> implements IFactory<T>  {

	static create<T extends ModelName>(...params: ConstructorParameters<typeof Factory<T>>) {
		return new class extends Factory<T> { }(...params)
	}

	values: CreatedModel<T>[] = [];
	name;
	increment = 0;


	constructor(name: T) {
		this.name = name;
	}

	async create(data: CreateModel<T>): Promise<CreatedModel<T>> {
		this.increment++;
		replaceLine(`${spinner()} Creating ${this.name} ${this.increment}`);

		if ((data as any)?.id !== undefined) throw "Id cannot be defined!";
		// @ts-ignore
		const result = await prisma[this.name].create({ data })
		this.values.push(result)

		return result;
	}

}

export abstract class NamedFactory<T extends ModelName> implements IFactory<T>  {

	static create<T extends ModelName>(...params: ConstructorParameters<typeof NamedFactory<T>>) {
		return new class extends NamedFactory<T> { }(...params)
	}

	private factory: (name: string) => CreateModel<T>
	private items = new Map<string, CreatedModel<T>>();
	name;

	get values() { return Array.from(this.items.values()) }

	constructor(name: T, factory: NamedFactory<T>['factory']) {
		this.name = name;
		this.factory = factory;
	}

	get(name: string) {
		return this.items.get(name);
	}

	async getCreate(name: string, data?: CreateModel<T>): Promise<CreatedModel<T>> {
		return this.items.get(name) ?? await this.create(name, data);
	}

	async create(name: string, data?: CreateModel<T>): Promise<CreatedModel<T>> {
		replaceLine(`${spinner()} Creating ${this.name} "${name}"`);

		if (this.items.has(name)) throw Error(`"${name}" already exists!`);
		if ((data as any)?.id !== undefined) throw Error("Id cannot be defined!");
		data ??= this.factory(name)
		// @ts-ignore
		const result = await prisma[this.name].create({ data })
		this.items.set(name, result)
		return result;
	}

	async update(name: string, data: UpdateModel<T>): Promise<CreatedModel<T>> {
		let item = this.items.get(name);
		if (!item) throw Error(`"${name}" does not exists!`);
		data ??= this.factory(name)
		// @ts-ignore
		item = await prisma[this.name].update({
			where: {
				// @ts-ignore
				id: item.id,
			},
			data,
		})
		if (!item) throw Error(`"${name}" was not found in db!`);
		// @ts-ignore
		this.items.set(name, item)
		return item;
	}
}

type InferType<T> = T extends ({ connectOrCreate?: infer R1 | Array<infer R1> }) ? R1 extends { create: infer R2 } ? R2 : never : never

type Connectable = {
	create?: any[] | any
	connect?: any[] | any
	connectOrCreate?: any[] | any
}

type ConnectableKeys<T> = {
	[P in keyof Required<T>]: Required<T>[P] extends Connectable ? P : never;
}[keyof T];

export function ezPushConnect<T, K extends ConnectableKeys<T>>(target: T, key: K, ...create: InferType<T[K]>[]): T[K]
export function ezPushConnect<T, K extends ConnectableKeys<T>>(target: any, key: K, ...create: any[]) {
	target[key] ??= {}
	target[key].connectOrCreate ??= []
	target[key].connectOrCreate.push(...create.map(v => ({
		create: v,
		where: {
			id: v.id
		}
	})))
	return target[key];
}

export function ezUpsert<T extends { id: number }>(create: T) {
	const noId = { ...create, id: undefined };
	return {
		update: noId,
		create: noId,
		where: { id: create.id }
	}
}

export function ezConnect<T extends { id: number }>(create: T): {
	connectOrCreate: {
		create: T;
		where: {
			id: number;
		};
	}
}
export function ezConnect<T extends { id: number }>(create: T[]): {
	connectOrCreate: {
		create: T;
		where: {
			id: number;
		};
	}[]
}
export function ezConnect<T extends { id: number }>(create: T | T[]) {

	if (Array.isArray(create)) {
		return {
			connectOrCreate: create.map(v => ({
				create: v,
				where: {
					id: v.id
				}
			}))
		}
	} else {
		return {
			connectOrCreate: {
				create: create,
				where: {
					id: create.id
				}
			}
		}
	}

}