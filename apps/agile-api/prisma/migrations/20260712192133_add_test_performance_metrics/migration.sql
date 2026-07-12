-- CreateEnum
CREATE TYPE "TestSuite" AS ENUM ('lint', 'unit', 'federation', 'storybook', 'code_examples');

-- CreateEnum
CREATE TYPE "Browser" AS ENUM ('chromium', 'firefox', 'webkit');

-- CreateEnum
CREATE TYPE "PerformanceStatus" AS ENUM ('excellent', 'good', 'warning', 'critical');

-- CreateTable
CREATE TABLE "TestPerformanceMetric" (
    "id" TEXT NOT NULL,
    "testSuite" "TestSuite" NOT NULL,
    "testName" TEXT NOT NULL,
    "browser" "Browser",
    "durationMs" INTEGER NOT NULL,
    "baselineMs" INTEGER NOT NULL,
    "thresholdMs" INTEGER NOT NULL,
    "status" "PerformanceStatus" NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "commitHash" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestPerformanceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestPerformanceMetric_testSuite_idx" ON "TestPerformanceMetric"("testSuite");

-- CreateIndex
CREATE INDEX "TestPerformanceMetric_testName_idx" ON "TestPerformanceMetric"("testName");

-- CreateIndex
CREATE INDEX "TestPerformanceMetric_recordedAt_idx" ON "TestPerformanceMetric"("recordedAt");
