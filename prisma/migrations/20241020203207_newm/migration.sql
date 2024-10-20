-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('Female', 'Male');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('NOTE', 'QUOTE');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('CREATED', 'ACTIVATED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "LibraryShelf" AS ENUM ('LIKE', 'HAVE', 'WANT_TO_READ', 'READING', 'RED');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" VARCHAR(24) NOT NULL,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'CREATED',
    "avatar" VARCHAR(255),
    "password" VARCHAR(128) NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" UUID NOT NULL,
    "gender" "UserGender",
    "birthday" TIMESTAMP(3),
    "coverPicture" VARCHAR(255),
    "timeZone" VARCHAR(255),
    "bio" VARCHAR(512),
    "favoriteAuthor" VARCHAR(128),
    "favoriteBook" VARCHAR(255),
    "favoriteGenres" TEXT[],
    "centerOfInterest" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255),
    "isbn" VARCHAR(64),
    "authors" TEXT[],
    "pageCount" INTEGER NOT NULL,
    "summary" TEXT,
    "cover" VARCHAR(255),
    "publicationDate" DATE,
    "publisher" VARCHAR(128),
    "edition" VARCHAR(255),
    "editors" TEXT[],
    "language" VARCHAR(128) NOT NULL,
    "genre" VARCHAR(64),
    "tags" TEXT[],
    "dimensions" VARCHAR(128),

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" UUID NOT NULL,
    "reference" VARCHAR(128) NOT NULL,
    "type" "NoteType" NOT NULL DEFAULT 'NOTE',
    "text" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "attachment" VARCHAR(255),
    "userId" UUID NOT NULL,
    "bookId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library" (
    "id" UUID NOT NULL,
    "status" VARCHAR(64) NOT NULL,
    "stopOn" VARCHAR(128),
    "readingCompletionDate" DATE,
    "rating" INTEGER,
    "userId" UUID NOT NULL,
    "bookId" UUID NOT NULL,
    "shelf" "LibraryShelf" DEFAULT 'HAVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" UUID NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "reference" VARCHAR(128),
    "medias" TEXT[],
    "userId" UUID NOT NULL,
    "bookId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" UUID NOT NULL,
    "parentId" UUID,
    "text" TEXT NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postlike" (
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postlike_pkey" PRIMARY KEY ("postId","userId")
);

-- CreateTable
CREATE TABLE "commentlike" (
    "commentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commentlike_pkey" PRIMARY KEY ("commentId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_parentId_key" ON "comment"("parentId");

-- CreateIndex
CREATE INDEX "comment_parentId_idx" ON "comment"("parentId");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library" ADD CONSTRAINT "library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library" ADD CONSTRAINT "library_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postlike" ADD CONSTRAINT "postlike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postlike" ADD CONSTRAINT "postlike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentlike" ADD CONSTRAINT "commentlike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentlike" ADD CONSTRAINT "commentlike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
