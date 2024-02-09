-- CreateTable
CREATE TABLE "accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,
    CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT,
    "email_verified" DATETIME,
    "image" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstname" TEXT,
    "lastname" TEXT,
    "bio" TEXT,
    CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_paths" (
    "user_id" INTEGER NOT NULL,
    "path_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "self_score" INTEGER NOT NULL,
    "completion" REAL NOT NULL,

    PRIMARY KEY ("user_id", "path_id"),
    CONSTRAINT "user_paths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_paths_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "paths" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_skills" (
    "user_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "score" REAL NOT NULL,

    PRIMARY KEY ("user_id", "skill_id"),
    CONSTRAINT "user_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "skills" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "skill_questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skill_id" INTEGER NOT NULL,
    "text" TEXT,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    CONSTRAINT "skill_questions_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "skill_question_options" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "skill_question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "skill_questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "paths" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "icon" TEXT
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path_id" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    CONSTRAINT "milestones_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "paths" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "milestone_skill_requirements" (
    "milestone_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    CONSTRAINT "milestone_skill_requirements_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "milestone_skill_requirements_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "milestone_id" INTEGER NOT NULL,
    "max_seconds" INTEGER,
    "min_score" INTEGER,
    CONSTRAINT "assessments_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assessment_id" INTEGER NOT NULL,
    "text" TEXT,
    "type" TEXT NOT NULL,
    CONSTRAINT "questions_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "options" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PathToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PathToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "paths" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PathToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MilestoneToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MilestoneToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "milestones" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MilestoneToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "milestone_skill_requirements_skill_id_score_key" ON "milestone_skill_requirements"("skill_id", "score");

-- CreateIndex
CREATE UNIQUE INDEX "_PathToSkill_AB_unique" ON "_PathToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_PathToSkill_B_index" ON "_PathToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MilestoneToSkill_AB_unique" ON "_MilestoneToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_MilestoneToSkill_B_index" ON "_MilestoneToSkill"("B");
