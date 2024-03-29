import prisma from "./seed-util";
import SeedDB from "./seed-db";
import {
  check,
  endSpinner,
  replaceLine,
  spinner,
  withSpinner,
  writeErr,
  writeLine,
} from "./std-utils";

async function main() {
  const clear = withSpinner();

  writeLine(`\n`);
  replaceLine(`${spinner()} Starting seeding.`);

  try {
    await SeedDB.init();
    replaceLine(`${check} Seeding finished.\n`);
  } catch (error) {
    writeErr(`${check} Seeding failed.\n`);
    throw error;
  } finally {
    clear();
    endSpinner();
  }
}

main()
  .then(async () => {
    await prisma.$queryRaw`
    SELECT pg_terminate_backend(PSA.pid)
    FROM pg_locks AS PL
        INNER JOIN pg_stat_activity AS PSA ON PSA.pid = PL.pid
    WHERE PSA.state LIKE 'idle'
        AND PL.objid IN (72707369);`;
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$queryRaw`
    SELECT pg_terminate_backend(PSA.pid)
    FROM pg_locks AS PL
        INNER JOIN pg_stat_activity AS PSA ON PSA.pid = PL.pid
    WHERE PSA.state LIKE 'idle'
        AND PL.objid IN (72707369);`;
    await prisma.$disconnect();
    process.exit(1);
  });
