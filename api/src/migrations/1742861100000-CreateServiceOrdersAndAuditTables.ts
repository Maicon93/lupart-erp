import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceOrdersAndAuditTables1742861100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Fase 7: Ordens de Serviço ──

        await queryRunner.query(`
            CREATE TABLE "service_orders" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER NOT NULL,
                "customer_id" INTEGER NOT NULL,
                "observation" VARCHAR,
                "date_started" TIMESTAMP,
                "date_finished" TIMESTAMP,
                "total_value" DECIMAL(10, 2) NOT NULL DEFAULT 0,
                "discount_percentage" DECIMAL(5, 2) NOT NULL DEFAULT 0,
                "discount_value" DECIMAL(10, 2) NOT NULL DEFAULT 0,
                "final_value" DECIMAL(10, 2),
                "payment_form" VARCHAR,
                "status" VARCHAR NOT NULL DEFAULT 'aberta',
                "cancellation_reason" TEXT,
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_service_orders_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_service_orders_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id"),
                CONSTRAINT "FK_service_orders_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "service_order_items" (
                "id" SERIAL PRIMARY KEY,
                "service_order_id" INTEGER NOT NULL,
                "product_id" INTEGER NOT NULL,
                "quantity" DECIMAL(10, 3) NOT NULL,
                "unit_price" DECIMAL(10, 2) NOT NULL,
                "subtotal" DECIMAL(10, 2) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_service_order_items_service_order" FOREIGN KEY ("service_order_id") REFERENCES "service_orders"("id"),
                CONSTRAINT "FK_service_order_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "service_order_technicians" (
                "id" SERIAL PRIMARY KEY,
                "service_order_id" INTEGER NOT NULL,
                "user_id" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" INTEGER NOT NULL,
                CONSTRAINT "FK_service_order_technicians_service_order" FOREIGN KEY ("service_order_id") REFERENCES "service_orders"("id"),
                CONSTRAINT "FK_service_order_technicians_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
                CONSTRAINT "FK_service_order_technicians_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id"),
                CONSTRAINT "UQ_service_order_technicians" UNIQUE ("service_order_id", "user_id")
            )
        `);

        // ── Fase 8: Auditoria ──

        await queryRunner.query(`
            CREATE TABLE "activity_logs" (
                "id" SERIAL PRIMARY KEY,
                "company_id" INTEGER,
                "entity_type" VARCHAR NOT NULL,
                "entity_id" INTEGER NOT NULL,
                "action" VARCHAR NOT NULL,
                "data" JSONB,
                "created_by" INTEGER NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_activity_logs_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id"),
                CONSTRAINT "FK_activity_logs_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "activity_logs"`);
        await queryRunner.query(`DROP TABLE "service_order_technicians"`);
        await queryRunner.query(`DROP TABLE "service_order_items"`);
        await queryRunner.query(`DROP TABLE "service_orders"`);
    }
}
