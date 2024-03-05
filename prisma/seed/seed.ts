
import prisma from './seed-util'
import SeedDB from './seed-db'
import { check, endSpinner, replaceLine, spinner, withSpinner, writeErr, writeLine } from './std-utils';

async function main() {

  const clear = withSpinner()


  writeLine(`\n`)
  replaceLine(`${spinner()} Starting seeding.`)

  try {
    await SeedDB.init();
    replaceLine(`${check} Seeding finished.\n`)
  } catch (error) {
    writeErr(`${check} Seeding failed.\n`)
    throw error;
  } finally {
    clear();
    endSpinner()
  }

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
