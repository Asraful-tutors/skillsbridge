
export abstract class ModelFactory<T> {
	private id = 1;

	public create(input: Omit<T, 'id'>): T & { id: number } {
		if ((input as any).id)
			throw Error("Objects with a defined id are not allowed. How can you recreate an item with an id?");
		var object = input as T & { id: number };
		object.id = this.id;
		this.id++;
		return object;
	}
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