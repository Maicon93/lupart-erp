import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInfrastructureAndCatalogTables1742860900000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Enums ──
        await queryRunner.query(`CREATE TYPE "category_status" AS ENUM ('active', 'inactive')`);
        await queryRunner.query(`CREATE TYPE "measurement_unit_status" AS ENUM ('active', 'inactive')`);
        await queryRunner.query(`CREATE TYPE "payment_type_status" AS ENUM ('active', 'inactive')`);

        // ── Fase 3: Infraestrutura ──

        await queryRunner.query(`
            CREATE TABLE "company_profiles" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL UNIQUE,
                "phone" VARCHAR,
                "email" VARCHAR,
                "zip_code" VARCHAR,
                "street" VARCHAR NOT NULL,
                "number" VARCHAR NOT NULL,
                "complement" VARCHAR NOT NULL,
                "neighborhood" VARCHAR NOT NULL,
                "city" VARCHAR,
                "state" VARCHAR,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_company_profiles_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "company_settings" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL UNIQUE,
                "allow_negative_stock" BOOLEAN NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_company_settings_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "user_profiles" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER NOT NULL UNIQUE,
                "phone" VARCHAR NOT NULL,
                "country" VARCHAR NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_user_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "user_companies" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER NOT NULL,
                "company_id" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" INTEGER NOT NULL,
                CONSTRAINT "FK_user_companies_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
                CONSTRAINT "FK_user_companies_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_user_companies_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id"),
                CONSTRAINT "UQ_user_companies_user_company" UNIQUE ("user_id", "company_id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER NOT NULL,
                "token" VARCHAR NOT NULL UNIQUE,
                "expires_at" TIMESTAMP NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_refresh_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER NOT NULL,
                "role_id" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" INTEGER NOT NULL,
                CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
                CONSTRAINT "FK_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id"),
                CONSTRAINT "FK_user_roles_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id"),
                CONSTRAINT "UQ_user_roles_user_role" UNIQUE ("user_id", "role_id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "role_permissions" (
                "id" SERIAL PRIMARY KEY,
                "role_id" INTEGER NOT NULL,
                "permission_id" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" INTEGER NOT NULL,
                CONSTRAINT "FK_role_permissions_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id"),
                CONSTRAINT "FK_role_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id"),
                CONSTRAINT "FK_role_permissions_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id"),
                CONSTRAINT "UQ_role_permissions_role_permission" UNIQUE ("role_id", "permission_id")
            )
        `);

        // ── Fase 4: Cadastros ──

        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "name" VARCHAR NOT NULL,
                "observation" VARCHAR,
                "status" "category_status" NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_categories_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "UQ_categories_company_name" UNIQUE ("company_id", "name")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "measurement_units" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "abbreviation" VARCHAR(10) NOT NULL,
                "description" VARCHAR NOT NULL,
                "status" "measurement_unit_status" NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_measurement_units_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "UQ_measurement_units_company_abbreviation" UNIQUE ("company_id", "abbreviation")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "payment_types" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "name" VARCHAR NOT NULL,
                "observation" TEXT,
                "status" "payment_type_status" NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_payment_types_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "UQ_payment_types_company_name" UNIQUE ("company_id", "name")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "customers" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "name" VARCHAR NOT NULL,
                "cpf_cnpj" VARCHAR NOT NULL,
                "phone" VARCHAR NOT NULL,
                "email" VARCHAR,
                "zip_code" VARCHAR,
                "street" VARCHAR,
                "number" VARCHAR,
                "complement" VARCHAR,
                "neighborhood" VARCHAR,
                "city" VARCHAR,
                "state" VARCHAR,
                "notes" TEXT,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "FK_customers_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id")
            )
        `);

        // Unique parcial: cpf_cnpj único por company_id apenas para registros não deletados
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_customers_company_cpf_cnpj" ON "customers" ("company_id", "cpf_cnpj") WHERE "deleted_at" IS NULL
        `);

        await queryRunner.query(`
            CREATE TABLE "suppliers" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "name" VARCHAR NOT NULL,
                "cpf_cnpj" VARCHAR NOT NULL,
                "phone" VARCHAR NOT NULL,
                "email" VARCHAR,
                "zip_code" VARCHAR,
                "street" VARCHAR,
                "number" VARCHAR,
                "complement" VARCHAR,
                "neighborhood" VARCHAR,
                "city" VARCHAR,
                "state" VARCHAR,
                "notes" TEXT,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "FK_suppliers_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id")
            )
        `);

        // Unique parcial: cpf_cnpj único por company_id apenas para registros não deletados
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_suppliers_company_cpf_cnpj" ON "suppliers" ("company_id", "cpf_cnpj") WHERE "deleted_at" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ── Fase 4 ──
        await queryRunner.query(`DROP INDEX "UQ_suppliers_company_cpf_cnpj"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP INDEX "UQ_customers_company_cpf_cnpj"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "payment_types"`);
        await queryRunner.query(`DROP TABLE "measurement_units"`);
        await queryRunner.query(`DROP TABLE "categories"`);

        // ── Fase 3 ──
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "user_companies"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`DROP TABLE "company_settings"`);
        await queryRunner.query(`DROP TABLE "company_profiles"`);

        // ── Enums ──
        await queryRunner.query(`DROP TYPE "payment_type_status"`);
        await queryRunner.query(`DROP TYPE "measurement_unit_status"`);
        await queryRunner.query(`DROP TYPE "category_status"`);
    }
}
