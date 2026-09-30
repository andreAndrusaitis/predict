CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'ADMIN', 'MODELER', 'REVIEWER', 'VIEWER');
CREATE TYPE "DecisionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "RunStatus" AS ENUM ('PENDING', 'RUNNING', 'CANCEL_REQUESTED', 'SUCCEEDED', 'FAILED', 'CANCELLED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Organization" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrganizationMember" (
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "OrganizationRole" NOT NULL DEFAULT 'VIEWER',
  CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("organizationId", "userId"),
  CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Project" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);
CREATE INDEX "Project_organizationId_createdAt_idx" ON "Project"("organizationId", "createdAt");

CREATE TABLE "Decision" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" "DecisionStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Decision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Decision_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);
CREATE INDEX "Decision_projectId_createdAt_idx" ON "Decision"("projectId", "createdAt");

CREATE TABLE "Scenario" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "decisionId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "spec" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Scenario_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "Scenario_decisionId_version_key" ON "Scenario"("decisionId", "version");

CREATE TABLE "SimulationRun" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "scenarioId" TEXT NOT NULL,
  "status" "RunStatus" NOT NULL DEFAULT 'PENDING',
  "seed" INTEGER NOT NULL,
  "engineVersion" TEXT NOT NULL,
  "specificationHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "result" JSONB,
  CONSTRAINT "SimulationRun_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SimulationRun_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT
);
CREATE INDEX "SimulationRun_scenarioId_createdAt_idx" ON "SimulationRun"("scenarioId", "createdAt");
CREATE INDEX "SimulationRun_status_createdAt_idx" ON "SimulationRun"("status", "createdAt");

