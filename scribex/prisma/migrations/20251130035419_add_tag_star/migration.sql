-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('WORK', 'PERSONAL', 'STUDY', 'IDEAS', 'OTHER');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tag" "Tag";
