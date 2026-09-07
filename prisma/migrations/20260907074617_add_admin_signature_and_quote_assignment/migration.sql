-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN "phone" TEXT;
ALTER TABLE "AdminUser" ADD COLUMN "signatureUrl" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuoteDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "conversationId" TEXT,
    "quoteRequestId" TEXT,
    "assignedAdminId" TEXT,
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyName" TEXT,
    "attn" TEXT,
    "tel" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "creditTerm" TEXT NOT NULL DEFAULT '0',
    "deliveryDays" TEXT NOT NULL DEFAULT '',
    "validityDays" INTEGER NOT NULL DEFAULT 20,
    "vatPercent" REAL NOT NULL DEFAULT 7,
    "salesName" TEXT,
    "salesPhone" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sentAt" DATETIME,
    CONSTRAINT "QuoteDocument_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "AdminUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QuoteDocument" ("attn", "companyName", "conversationId", "createdAt", "creditTerm", "deliveryDays", "email", "fax", "id", "issueDate", "notes", "quoteNumber", "quoteRequestId", "salesName", "salesPhone", "sentAt", "status", "tel", "updatedAt", "validityDays", "vatPercent") SELECT "attn", "companyName", "conversationId", "createdAt", "creditTerm", "deliveryDays", "email", "fax", "id", "issueDate", "notes", "quoteNumber", "quoteRequestId", "salesName", "salesPhone", "sentAt", "status", "tel", "updatedAt", "validityDays", "vatPercent" FROM "QuoteDocument";
DROP TABLE "QuoteDocument";
ALTER TABLE "new_QuoteDocument" RENAME TO "QuoteDocument";
CREATE UNIQUE INDEX "QuoteDocument_quoteNumber_key" ON "QuoteDocument"("quoteNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
