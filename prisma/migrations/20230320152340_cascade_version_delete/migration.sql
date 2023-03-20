-- DropForeignKey
ALTER TABLE "releases" DROP CONSTRAINT "releases_versionId_fkey";

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
