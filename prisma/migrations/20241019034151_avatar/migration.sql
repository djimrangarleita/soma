/*
  Warnings:

  - You are about to drop the column `profilePicture` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "profilePicture";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatar" VARCHAR(255);
