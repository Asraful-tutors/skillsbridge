import { Prisma, PrismaClient } from '@prisma/client'
import { SelectQuestions, TextQuestions, Skills } from './skills'
import { Paths } from './paths'
import { ezUpsert } from './seed-util'

const prisma = new PrismaClient()


type Models = Prisma.TypeMap<any>['meta']['modelProps']

type ObjectType<T extends Models> = Omit<Parameters<PrismaClient[T]['upsert']>[0]['create'], 'id'> & { id: number }

async function apply<T extends Models>(name: T, objects: ObjectType<T>[]) {
  const singular = name;
  const plural = name + 's';
  console.log(`Creating ${plural}`);

  for (const object of objects) {
    console.log(`Creating ${singular} ${object.id}`);
    var res = await prisma[name as 'user'].upsert(ezUpsert(object))
    if (res.id !== object.id)
      console.warn(`Created ${singular} id mismatched! (db) ${res.id} !== ${object.id} (input)`)
  }
}

/**
 * Count the number of Paths.
 * Note, that providing `undefined` is treated as the value not being there.
 * Read more here: https://pris.ly/d/null-undefined
 * @param {PathCountArgs} args - Arguments to filter Paths to count.
 * @example
 * // Count the number of Paths
 * const count = await prisma.path.count({
 *   where: {
 *     // ... the filter for the Paths we want to count
 *   }
 * })
**/

async function main() {

  console.log(`Start seeding ...`)

  await apply("path", Object.values(Paths))
  await apply("skill", Object.values(Skills))

  await apply("skillQuestion", SelectQuestions)
  await apply("skillQuestion", TextQuestions)

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
