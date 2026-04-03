import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsStockSalesFinancialTables1742861000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Enums ──
        await queryRunner.query(`CREATE TYPE "product_type" AS ENUM ('product', 'service')`);
        await queryRunner.query(`CREATE TYPE "product_status" AS ENUM ('active', 'inactive')`);
        await queryRunner.query(`CREATE TYPE "inventory_scope" AS ENUM ('all', 'category')`);
        await queryRunner.query(`CREATE TYPE "inventory_status" AS ENUM ('in_progress', 'finalized')`);
        await queryRunner.query(
            `CREATE TYPE "product_movimentation_type" AS ENUM ('entry', 'adjustment', 'inventory', 'sale', 'sale_return', 'service_order')`
        );
        await queryRunner.query(`CREATE TYPE "sale_status" AS ENUM ('finalized', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "sale_payment_form" AS ENUM ('cash', 'installment')`);

        // ── Fase 5: Produtos e Estoque ──

        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "type" "product_type" NOT NULL,
                "name" VARCHAR NOT NULL,
                "code" VARCHAR,
                "barcode" VARCHAR,
                "description" TEXT,
                "category_id" INTEGER NOT NULL,
                "measurement_unit_id" INTEGER,
                "sale_price" DECIMAL(10, 2) NOT NULL,
                "average_cost" DECIMAL(10, 2) NOT NULL DEFAULT 0,
                "stock" DECIMAL(10, 3) NOT NULL DEFAULT 0,
                "minimum_stock" DECIMAL(10, 3),
                "notes" TEXT,
                "status" "product_status" NOT NULL DEFAULT 'active',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_products_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_products_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id"),
                CONSTRAINT "FK_products_measurement_unit" FOREIGN KEY ("measurement_unit_id") REFERENCES "measurement_units"("id")
            )
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_products_company_code" ON "products" ("company_id", "code") WHERE "code" IS NOT NULL
        `);

        await queryRunner.query(`
            CREATE TABLE "product_images" (
                "id" SERIAL PRIMARY KEY,
                "product_id" INTEGER NOT NULL,
                "url" VARCHAR NOT NULL,
                "position" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_product_images_product" FOREIGN KEY ("product_id") REFERENCES "products"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "stock_entries" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "supplier_id" INTEGER,
                "invoice_number" VARCHAR,
                "observation" TEXT,
                "total_value" DECIMAL(10, 2),
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_stock_entries_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_stock_entries_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id"),
                CONSTRAINT "FK_stock_entries_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "stock_entry_items" (
                "id" SERIAL PRIMARY KEY,
                "stock_entry_id" INTEGER NOT NULL,
                "product_id" INTEGER NOT NULL,
                "quantity" DECIMAL(10, 3) NOT NULL,
                "unit_price" DECIMAL(10, 2),
                "subtotal" DECIMAL(10, 2),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_stock_entry_items_stock_entry" FOREIGN KEY ("stock_entry_id") REFERENCES "stock_entries"("id"),
                CONSTRAINT "FK_stock_entry_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "stock_adjustments" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "date" DATE NOT NULL,
                "reason" TEXT NOT NULL,
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_stock_adjustments_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_stock_adjustments_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "stock_adjustment_items" (
                "id" SERIAL PRIMARY KEY,
                "stock_adjustment_id" INTEGER NOT NULL,
                "product_id" INTEGER NOT NULL,
                "previous_quantity" DECIMAL(10, 3) NOT NULL,
                "new_quantity" DECIMAL(10, 3) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_stock_adjustment_items_stock_adjustment" FOREIGN KEY ("stock_adjustment_id") REFERENCES "stock_adjustments"("id"),
                CONSTRAINT "FK_stock_adjustment_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id"),
                CONSTRAINT "CHK_stock_adjustment_items_new_quantity" CHECK ("new_quantity" >= 0)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "inventories" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "scope" "inventory_scope" NOT NULL,
                "category_id" INTEGER,
                "date" DATE NOT NULL,
                "observation" TEXT,
                "status" "inventory_status" NOT NULL DEFAULT 'in_progress',
                "adjustment_id" INTEGER,
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_inventories_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_inventories_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id"),
                CONSTRAINT "FK_inventories_adjustment" FOREIGN KEY ("adjustment_id") REFERENCES "stock_adjustments"("id"),
                CONSTRAINT "FK_inventories_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "inventory_items" (
                "id" SERIAL PRIMARY KEY,
                "inventory_id" INTEGER NOT NULL,
                "product_id" INTEGER NOT NULL,
                "system_quantity" DECIMAL(10, 3) NOT NULL,
                "counted_quantity" DECIMAL(10, 3),
                "counted_by" INTEGER,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_inventory_items_inventory" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id"),
                CONSTRAINT "FK_inventory_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id"),
                CONSTRAINT "FK_inventory_items_counted_by" FOREIGN KEY ("counted_by") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "product_movimentations" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "product_id" INTEGER NOT NULL,
                "type" "product_movimentation_type" NOT NULL,
                "reference_id" INTEGER NOT NULL,
                "previous_quantity" DECIMAL(10, 3) NOT NULL,
                "new_quantity" DECIMAL(10, 3) NOT NULL,
                "amount" DECIMAL(10, 3) NOT NULL,
                "value" DECIMAL(10, 2),
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_product_movimentations_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_product_movimentations_product" FOREIGN KEY ("product_id") REFERENCES "products"("id"),
                CONSTRAINT "FK_product_movimentations_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        // ── Fase 6: Vendas e Financeiro ──

        await queryRunner.query(`
            CREATE TABLE "sales" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "customer_id" INTEGER NOT NULL,
                "date" DATE NOT NULL,
                "observation" TEXT,
                "status" "sale_status" NOT NULL DEFAULT 'finalized',
                "payment_form" "sale_payment_form" NOT NULL,
                "discount_percentage" DECIMAL(5, 2) NOT NULL DEFAULT 0,
                "discount_value" DECIMAL(10, 2) NOT NULL DEFAULT 0,
                "total_value" DECIMAL(10, 2) NOT NULL,
                "final_value" DECIMAL(10, 2) NOT NULL,
                "cancellation_reason" TEXT,
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_sales_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_sales_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id"),
                CONSTRAINT "FK_sales_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "sale_items" (
                "id" SERIAL PRIMARY KEY,
                "sale_id" INTEGER NOT NULL,
                "product_id" INTEGER NOT NULL,
                "quantity" DECIMAL(10, 3) NOT NULL,
                "unit_price" DECIMAL(10, 2) NOT NULL,
                "subtotal" DECIMAL(10, 2) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_sale_items_sale" FOREIGN KEY ("sale_id") REFERENCES "sales"("id"),
                CONSTRAINT "FK_sale_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "quotes" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "customer_id" INTEGER NOT NULL,
                "validity_date" DATE NOT NULL,
                "observation" VARCHAR,
                "discount_percentage" DECIMAL(5, 2) NOT NULL DEFAULT 0,
                "discount_value" DECIMAL(10, 2) NOT NULL DEFAULT 0,
                "total_value" DECIMAL(10, 2) NOT NULL,
                "final_value" DECIMAL(10, 2) NOT NULL,
                "payment_type_id" INTEGER,
                "status" VARCHAR NOT NULL DEFAULT 'emitido',
                "sale_id" INTEGER,
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "FK_quotes_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_quotes_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id"),
                CONSTRAINT "FK_quotes_payment_type" FOREIGN KEY ("payment_type_id") REFERENCES "payment_types"("id"),
                CONSTRAINT "FK_quotes_sale" FOREIGN KEY ("sale_id") REFERENCES "sales"("id"),
                CONSTRAINT "FK_quotes_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "quote_items" (
                "id" SERIAL PRIMARY KEY,
                "quote_id" INTEGER NOT NULL,
                "product_id" INTEGER NOT NULL,
                "quantity" DECIMAL(10, 3) NOT NULL,
                "unit_price" DECIMAL(10, 2) NOT NULL,
                "subtotal" DECIMAL(10, 2) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_quote_items_quote" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id"),
                CONSTRAINT "FK_quote_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "financial_titles" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "customer_id" INTEGER,
                "supplier_id" INTEGER,
                "type" VARCHAR NOT NULL,
                "origin" VARCHAR NOT NULL,
                "reference_id" INTEGER,
                "parent_id" INTEGER,
                "value" DECIMAL(10, 2) NOT NULL,
                "due_date" DATE NOT NULL,
                "payment_date" DATE,
                "payment_type_id" INTEGER,
                "status" VARCHAR NOT NULL DEFAULT 'pendente',
                "observation" VARCHAR,
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "FK_financial_titles_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_financial_titles_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id"),
                CONSTRAINT "FK_financial_titles_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id"),
                CONSTRAINT "FK_financial_titles_parent" FOREIGN KEY ("parent_id") REFERENCES "financial_titles"("id"),
                CONSTRAINT "FK_financial_titles_payment_type" FOREIGN KEY ("payment_type_id") REFERENCES "payment_types"("id"),
                CONSTRAINT "FK_financial_titles_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "cash_movements" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "type" VARCHAR NOT NULL,
                "value" DECIMAL(10, 2) NOT NULL,
                "description" VARCHAR,
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "FK_cash_movements_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_cash_movements_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ── Fase 6 ──
        await queryRunner.query(`DROP TABLE "cash_movements"`);
        await queryRunner.query(`DROP TABLE "financial_titles"`);
        await queryRunner.query(`DROP TABLE "quote_items"`);
        await queryRunner.query(`DROP TABLE "quotes"`);
        await queryRunner.query(`DROP TABLE "sale_items"`);
        await queryRunner.query(`DROP TABLE "sales"`);

        // ── Fase 5 ──
        await queryRunner.query(`DROP TABLE "product_movimentations"`);
        await queryRunner.query(`DROP TABLE "inventory_items"`);
        await queryRunner.query(`DROP TABLE "inventories"`);
        await queryRunner.query(`DROP TABLE "stock_adjustment_items"`);
        await queryRunner.query(`DROP TABLE "stock_adjustments"`);
        await queryRunner.query(`DROP TABLE "stock_entry_items"`);
        await queryRunner.query(`DROP TABLE "stock_entries"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
        await queryRunner.query(`DROP INDEX "UQ_products_company_code"`);
        await queryRunner.query(`DROP TABLE "products"`);

        // ── Enums ──
        await queryRunner.query(`DROP TYPE "sale_payment_form"`);
        await queryRunner.query(`DROP TYPE "sale_status"`);
        await queryRunner.query(`DROP TYPE "product_movimentation_type"`);
        await queryRunner.query(`DROP TYPE "inventory_status"`);
        await queryRunner.query(`DROP TYPE "inventory_scope"`);
        await queryRunner.query(`DROP TYPE "product_status"`);
        await queryRunner.query(`DROP TYPE "product_type"`);
    }
}
