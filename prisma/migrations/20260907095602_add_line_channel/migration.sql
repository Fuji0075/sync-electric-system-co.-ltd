-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitorId" TEXT NOT NULL,
    "customerId" TEXT,
    "visitorName" TEXT,
    "visitorEmail" TEXT,
    "visitorPhone" TEXT,
    "needsAttention" BOOLEAN NOT NULL DEFAULT false,
    "unreadByVisitor" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'open',
    "channel" TEXT NOT NULL DEFAULT 'web',
    "lineUserId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Conversation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Conversation" ("createdAt", "customerId", "id", "needsAttention", "status", "unreadByVisitor", "updatedAt", "visitorEmail", "visitorId", "visitorName", "visitorPhone") SELECT "createdAt", "customerId", "id", "needsAttention", "status", "unreadByVisitor", "updatedAt", "visitorEmail", "visitorId", "visitorName", "visitorPhone" FROM "Conversation";
DROP TABLE "Conversation";
ALTER TABLE "new_Conversation" RENAME TO "Conversation";
CREATE UNIQUE INDEX "Conversation_visitorId_key" ON "Conversation"("visitorId");
CREATE UNIQUE INDEX "Conversation_lineUserId_key" ON "Conversation"("lineUserId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
