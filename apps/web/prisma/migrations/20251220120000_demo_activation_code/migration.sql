-- CreateTable
CREATE TABLE "DemoActivationCode" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "redeemedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoActivationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoActivationCode_codeHash_key" ON "DemoActivationCode"("codeHash");

-- CreateIndex
CREATE INDEX "DemoActivationCode_email_idx" ON "DemoActivationCode"("email");

-- CreateIndex
CREATE INDEX "DemoActivationCode_expiresAt_idx" ON "DemoActivationCode"("expiresAt");

-- AddForeignKey
ALTER TABLE "DemoActivationCode" ADD CONSTRAINT "DemoActivationCode_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoActivationCode" ADD CONSTRAINT "DemoActivationCode_redeemedByUserId_fkey" FOREIGN KEY ("redeemedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
