/*
  Warnings:

  - The values [TWO_PLAYER] on the enum `QuizSessionMode` will be removed. If these variants are still used in the database, this will fail.
  - The values [PLAYER_ONE,PLAYER_TWO] on the enum `SessionParticipantSeat` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `joinCode` on the `QuizSession` table. All the data in the column will be lost.
  - You are about to drop the column `shareLink` on the `QuizSession` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuizSessionMode_new" AS ENUM ('SOLO');
ALTER TABLE "QuizSession" ALTER COLUMN "mode" TYPE "QuizSessionMode_new" USING ("mode"::text::"QuizSessionMode_new");
ALTER TYPE "QuizSessionMode" RENAME TO "QuizSessionMode_old";
ALTER TYPE "QuizSessionMode_new" RENAME TO "QuizSessionMode";
DROP TYPE "public"."QuizSessionMode_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SessionParticipantSeat_new" AS ENUM ('SOLO');
ALTER TABLE "SessionParticipant" ALTER COLUMN "seat" TYPE "SessionParticipantSeat_new" USING ("seat"::text::"SessionParticipantSeat_new");
ALTER TYPE "SessionParticipantSeat" RENAME TO "SessionParticipantSeat_old";
ALTER TYPE "SessionParticipantSeat_new" RENAME TO "SessionParticipantSeat";
DROP TYPE "public"."SessionParticipantSeat_old";
COMMIT;

-- DropIndex
DROP INDEX "QuizSession_joinCode_idx";

-- DropIndex
DROP INDEX "QuizSession_joinCode_key";

-- DropIndex
DROP INDEX "QuizSession_shareLink_key";

-- AlterTable
ALTER TABLE "QuizSession" DROP COLUMN "joinCode",
DROP COLUMN "shareLink";
