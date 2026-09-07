-- AlterTable
ALTER TABLE "Product" ADD COLUMN "price" REAL;

-- CreateTable
CREATE TABLE "QuoteDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "conversationId" TEXT,
    "quoteRequestId" TEXT,
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
    "sentAt" DATETIME
);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteDocumentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "unit" TEXT NOT NULL DEFAULT 'UNIT',
    "unitPrice" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "QuoteItem_quoteDocumentId_fkey" FOREIGN KEY ("quoteDocumentId") REFERENCES "QuoteDocument" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "QuoteDocument_quoteNumber_key" ON "QuoteDocument"("quoteNumber");
