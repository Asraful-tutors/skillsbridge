-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('Hard', 'Soft');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64),
    "email" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" INTEGER NOT NULL,
    "firstName" VARCHAR(64),
    "lastName" VARCHAR(64),
    "bio" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "CompletedMilestone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "userProfileId" INTEGER NOT NULL,

    CONSTRAINT "CompletedMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPath" (
    "userId" INTEGER NOT NULL,
    "pathId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "selfScore" INTEGER,
    "completion" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserPath_pkey" PRIMARY KEY ("userId","pathId")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "userId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "selfScore" DOUBLE PRECISION,
    "assessedScore" DOUBLE PRECISION,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("userId","skillId")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "type" "SkillType" NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Path" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "icon" TEXT,
    "alwaysActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Path_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" TEXT,
    "difficulty" "Difficulty" NOT NULL,
    "link" TEXT,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneSkillRequirement" (
    "milestoneId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maxSeconds" INTEGER,
    "minScore" INTEGER,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "assessmentId" INTEGER,
    "text" TEXT,
    "data" JSONB NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentRecord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assessmentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sealed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AssessmentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionRecord" (
    "id" SERIAL NOT NULL,
    "recordId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "sealed" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,

    CONSTRAINT "QuestionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PathToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MilestoneToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Path-Milestones" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Milestone-Assessment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserPath_userId_idx" ON "UserPath"("userId");

-- CreateIndex
CREATE INDEX "UserSkill_userId_idx" ON "UserSkill"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MilestoneSkillRequirement_milestoneId_skillId_key" ON "MilestoneSkillRequirement"("milestoneId", "skillId");

-- CreateIndex
CREATE INDEX "AssessmentRecord_userId_sealed_idx" ON "AssessmentRecord"("userId", "sealed");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionRecord_recordId_index_key" ON "QuestionRecord"("recordId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "_PathToSkill_AB_unique" ON "_PathToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_PathToSkill_B_index" ON "_PathToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MilestoneToSkill_AB_unique" ON "_MilestoneToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_MilestoneToSkill_B_index" ON "_MilestoneToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Path-Milestones_AB_unique" ON "_Path-Milestones"("A", "B");

-- CreateIndex
CREATE INDEX "_Path-Milestones_B_index" ON "_Path-Milestones"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Milestone-Assessment_AB_unique" ON "_Milestone-Assessment"("A", "B");

-- CreateIndex
CREATE INDEX "_Milestone-Assessment_B_index" ON "_Milestone-Assessment"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedMilestone" ADD CONSTRAINT "CompletedMilestone_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPath" ADD CONSTRAINT "UserPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPath" ADD CONSTRAINT "UserPath_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "Path"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneSkillRequirement" ADD CONSTRAINT "MilestoneSkillRequirement_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneSkillRequirement" ADD CONSTRAINT "MilestoneSkillRequirement_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentRecord" ADD CONSTRAINT "AssessmentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentRecord" ADD CONSTRAINT "AssessmentRecord_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionRecord" ADD CONSTRAINT "QuestionRecord_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "AssessmentRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionRecord" ADD CONSTRAINT "QuestionRecord_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PathToSkill" ADD CONSTRAINT "_PathToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Path"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PathToSkill" ADD CONSTRAINT "_PathToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MilestoneToSkill" ADD CONSTRAINT "_MilestoneToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MilestoneToSkill" ADD CONSTRAINT "_MilestoneToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Path-Milestones" ADD CONSTRAINT "_Path-Milestones_A_fkey" FOREIGN KEY ("A") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Path-Milestones" ADD CONSTRAINT "_Path-Milestones_B_fkey" FOREIGN KEY ("B") REFERENCES "Path"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Milestone-Assessment" ADD CONSTRAINT "_Milestone-Assessment_A_fkey" FOREIGN KEY ("A") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Milestone-Assessment" ADD CONSTRAINT "_Milestone-Assessment_B_fkey" FOREIGN KEY ("B") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
