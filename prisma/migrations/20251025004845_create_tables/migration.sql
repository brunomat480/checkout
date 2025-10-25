-- CreateTable
CREATE TABLE "payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'CREATED',
    "amount" REAL NOT NULL,
    "externalId" TEXT,
    "pixCode" TEXT,
    "pixQrCode" TEXT,
    "pixImageUrl" TEXT,
    "boletoCode" TEXT,
    "boletoUrl" TEXT,
    "barcodeImage" TEXT,
    "cardLastFour" TEXT,
    "cardBrand" TEXT,
    "installments" INTEGER DEFAULT 1,
    "processorResponse" TEXT,
    "failureReason" TEXT,
    "expiresAt" DATETIME,
    "paidAt" DATETIME,
    "refundedAt" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_externalId_key" ON "payments"("externalId");

-- CreateIndex
CREATE INDEX "payments_externalId_idx" ON "payments"("externalId");

-- CreateIndex
CREATE INDEX "payments_paymentStatus_idx" ON "payments"("paymentStatus");

-- CreateIndex
CREATE INDEX "payments_created_at_idx" ON "payments"("created_at");
