/*
  Warnings:

  - Added the required column `self_score` to the `user_skills` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_skills" (
    "user_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    "self_score" REAL NOT NULL,

    PRIMARY KEY ("user_id", "skill_id"),
    CONSTRAINT "user_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_skills" ("score", "skill_id", "user_id") SELECT "score", "skill_id", "user_id" FROM "user_skills";
DROP TABLE "user_skills";
ALTER TABLE "new_user_skills" RENAME TO "user_skills";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
