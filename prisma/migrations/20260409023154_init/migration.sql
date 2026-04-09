/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,participantId,questionId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Answer_sessionId_participantId_key";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "questionId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_sessionId_participantId_questionId_key" ON "Answer"("sessionId", "participantId", "questionId");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
