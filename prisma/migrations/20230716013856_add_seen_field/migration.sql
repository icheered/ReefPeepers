-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Species" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Species" ("id", "image", "name") SELECT "id", "image", "name" FROM "Species";
DROP TABLE "Species";
ALTER TABLE "new_Species" RENAME TO "Species";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
