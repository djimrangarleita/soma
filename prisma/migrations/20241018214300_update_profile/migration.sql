/*
  Warnings:

  - You are about to drop the column `illustration` on the `book` table. All the data in the column will be lost.
  - You are about to alter the column `edition` on the `book` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `language` on the `book` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(128)`.
  - You are about to alter the column `text` on the `post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - The `gender` column on the `profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('Female', 'Male');

-- AlterTable
ALTER TABLE "book" DROP COLUMN "illustration",
ADD COLUMN     "cover" VARCHAR(255),
ALTER COLUMN "subtitle" DROP NOT NULL,
ALTER COLUMN "publicationDate" SET DATA TYPE DATE,
ALTER COLUMN "publisher" DROP NOT NULL,
ALTER COLUMN "edition" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "language" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "genre" DROP NOT NULL;

-- AlterTable
ALTER TABLE "post" ALTER COLUMN "text" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "reference" DROP NOT NULL;

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "gender",
ADD COLUMN     "gender" "UserGender",
ALTER COLUMN "profilePicture" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "coverPicture" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "timeZone" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "favoriteAuthor" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "favoriteBook" SET DATA TYPE VARCHAR(255);
