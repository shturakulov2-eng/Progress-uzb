CREATE TABLE "Lead" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "fullName" TEXT NOT NULL,
  "companyName" TEXT,
  "businessType" TEXT,
  "phoneNumber" TEXT NOT NULL,
  "problem" TEXT,
  "source" TEXT NOT NULL DEFAULT 'contact',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt" DESC);
CREATE INDEX "Lead_companyName_idx" ON "Lead"("companyName");

ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public lead submissions"
  ON "Lead" FOR INSERT TO anon, authenticated
  WITH CHECK ("source" IN ('contact', 'service-inquiry'));

CREATE POLICY "Allow authenticated lead reads"
  ON "Lead" FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated lead deletes"
  ON "Lead" FOR DELETE TO authenticated
  USING (true);
