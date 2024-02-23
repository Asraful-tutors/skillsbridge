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

type ModelName = Prisma.TypeMap<any>["meta"]["modelProps"];

type UpdateModel<T extends ModelName> = Parameters<
  (typeof prisma)[T]["update"]
>[0]["data"];
type CreateModel<T extends ModelName> = Parameters<
  (typeof prisma)[T]["create"]
>[0]["data"];
type CreatedModel<T extends ModelName> = Awaited<
  ReturnType<(typeof prisma)[T]["create"]>
>;

interface IFactory<T extends ModelName> {
  values: CreateModel<T>[];
  name: T;
}

export abstract class Factory<T extends ModelName> implements IFactory<T> {
  static create<T extends ModelName>(
    ...params: ConstructorParameters<typeof Factory<T>>
  ) {
    return new (class extends Factory<T> {})(...params);
  }

  values: CreatedModel<T>[] = [];
  name;
  increment = 0;

  constructor(name: T) {
    this.name = name;
  }

  async createMulti(...datas: CreateModel<T>[]): Promise<CreatedModel<T>[]> {
    const res: CreatedModel<T>[] = [];
    for (const data of datas) {
      res.push(await this.create(data));
    }
    return res;
  }

  async create(data: CreateModel<T>): Promise<CreatedModel<T>> {
    this.increment++;
    replaceLine(`${spinner()} Creating ${this.name} ${this.increment}`);

    if ((data as any)?.id !== undefined) throw "Id cannot be defined!";
    // @ts-ignore
    const result = await prisma[this.name].create({ data });
    this.values.push(result);

    return result;
  }

  async update(id: number, data: UpdateModel<T>): Promise<CreatedModel<T>> {
    // @ts-ignore
    let item = await prisma[this.name].update({
      where: {
        // @ts-ignore
        id,
      },
      data,
    });
    this.values[id - 1] = item;
    return item;
  }
}

export abstract class NamedFactory<T extends ModelName> implements IFactory<T> {
  static create<T extends ModelName>(
    ...params: ConstructorParameters<typeof NamedFactory<T>>
  ) {
    return new (class extends NamedFactory<T> {})(...params);
  }

  private factory: (name: string) => CreateModel<T>;
  private items = new Map<string, CreatedModel<T>>();
  name;

  get values() {
    return Array.from(this.items.values());
  }

  constructor(name: T, factory: NamedFactory<T>["factory"]) {
    this.name = name;
    this.factory = factory;
  }

  get(name: string) {
    return this.items.get(name);
  }

  async getCreate(
    name: string,
    data?: CreateModel<T>
  ): Promise<CreatedModel<T>> {
    return this.items.get(name) ?? (await this.create(name, data));
  }

  async getCreateMulti(
    ...items: { name: string; data?: CreateModel<T> }[]
  ): Promise<CreatedModel<T>[]> {
    const res: CreatedModel<T>[] = [];
    for (const { name, data } of items) {
      res.push(await this.getCreate(name, data));
    }
    return res;
  }

  async create(name: string, data?: CreateModel<T>): Promise<CreatedModel<T>> {
    replaceLine(`${spinner()} Creating ${this.name} "${name}"`);

    if (this.items.has(name)) throw Error(`"${name}" already exists!`);
    if ((data as any)?.id !== undefined) throw Error("Id cannot be defined!");
    data ??= this.factory(name);
    // @ts-ignore
    const result = await prisma[this.name].create({ data });
    this.items.set(name, result);
    return result;
  }

  async update(name: string, data: UpdateModel<T>): Promise<CreatedModel<T>> {
    let item = this.items.get(name);
    if (!item) throw Error(`"${name}" does not exists!`);
    data ??= this.factory(name);
    // @ts-ignore
    item = await prisma[this.name].update({
      where: {
        // @ts-ignore
        id: item.id,
      },
      data,
    });
    if (!item) throw Error(`"${name}" was not found in db!`);
    // @ts-ignore
    this.items.set(name, item);
    return item;
  }
}

type InferType<T> = T extends { connectOrCreate?: infer R1 | Array<infer R1> }
  ? R1 extends { create: infer R2 }
    ? R2
    : never
  : never;

type Connectable = {
  create?: any[] | any;
  connect?: any[] | any;
  connectOrCreate?: any[] | any;
};

type ConnectableKeys<T> = {
  [P in keyof Required<T>]: Required<T>[P] extends Connectable ? P : never;
}[keyof T];

export function connect<T>(connect: T): {
  connect: T;
};
export function connect<T>(connect: T[]): {
  connect: T[];
};
export function connect<T>(connect: T | T[]) {
  if (Array.isArray(connect)) {
    return {
      connect: connect.map((v) => v),
    };
  } else {
    return {
      connect,
    };
  }
}
