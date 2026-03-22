import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCoreTables1742860800000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Enums ──
        await queryRunner.query(`CREATE TYPE "access_plan_status" AS ENUM ('active', 'inactive')`);
        await queryRunner.query(`CREATE TYPE "company_status" AS ENUM ('active', 'inactive')`);
        await queryRunner.query(`CREATE TYPE "user_status" AS ENUM ('active', 'inactive')`);

        // ── Fase 1: Tabelas globais sem dependências ──

        await queryRunner.query(`
            CREATE TABLE "access_plans" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR NOT NULL,
                "user_limit" INTEGER NOT NULL,
                "duration_days" INTEGER NOT NULL,
                "price" DECIMAL(10, 2) NOT NULL,
                "status" "access_plan_status" NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "system_configurations" (
                "id" SERIAL PRIMARY KEY,
                "key" VARCHAR NOT NULL UNIQUE,
                "value" VARCHAR NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL UNIQUE,
                "observation" VARCHAR,
                "created_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // ── Fase 2: Tabelas core (dependência circular) ──

        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "description" VARCHAR,
                "company_id" INTEGER,
                "created_by" INTEGER,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "companies" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "cnpj" VARCHAR NOT NULL UNIQUE,
                "access_plan_id" INTEGER NOT NULL,
                "responsible_id" INTEGER NOT NULL,
                "matriz" INTEGER,
                "plan_expires_at" DATE,
                "logo_url" VARCHAR,
                "status" "company_status" NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL UNIQUE,
                "password" VARCHAR NOT NULL,
                "language" VARCHAR NOT NULL DEFAULT 'pt-BR',
                "role_id" INTEGER NOT NULL,
                "company_id" INTEGER,
                "status" "user_status" NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // ── Foreign Keys (adicionadas após criar todas as tabelas) ──

        // roles
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_roles_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id")`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_roles_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")`);

        // companies
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_companies_access_plan" FOREIGN KEY ("access_plan_id") REFERENCES "access_plans"("id")`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_companies_responsible" FOREIGN KEY ("responsible_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_companies_matriz" FOREIGN KEY ("matriz") REFERENCES "companies"("id")`);

        // users
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ── Remove FKs primeiro ──
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_company"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_role"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_companies_matriz"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_companies_responsible"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_companies_access_plan"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_roles_created_by"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_roles_company"`);

        // ── Remove tabelas ──
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "system_configurations"`);
        await queryRunner.query(`DROP TABLE "access_plans"`);

        // ── Remove enums ──
        await queryRunner.query(`DROP TYPE "user_status"`);
        await queryRunner.query(`DROP TYPE "company_status"`);
        await queryRunner.query(`DROP TYPE "access_plan_status"`);
    }
}
