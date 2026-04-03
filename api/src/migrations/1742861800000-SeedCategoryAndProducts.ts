import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategoryAndProducts1742861800000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const company = await queryRunner.query(
            `SELECT "id" FROM "companies" WHERE "cnpj" = '12.148.983/0001-97'`
        );

        const companyId = company[0].id;

        await queryRunner.query(
            `INSERT INTO "categories" ("company_id", "name") VALUES ($1, 'Roupas')`,
            [companyId]
        );

        const category = await queryRunner.query(
            `SELECT "id" FROM "categories" WHERE "company_id" = $1 AND "name" = 'Roupas'`,
            [companyId]
        );

        const categoryId = category[0].id;

        const measurementUnit = await queryRunner.query(
            `SELECT "id" FROM "measurement_units" WHERE "company_id" = $1 AND "abbreviation" = 'Un'`,
            [companyId]
        );

        const unitId = measurementUnit[0]?.id || null;

        await queryRunner.query(
            `
            INSERT INTO "products" ("company_id", "type", "name", "category_id", "measurement_unit_id", "sale_price", "average_cost")
            VALUES
                ($1, 'product', 'Camiseta Manga Longa', $2, $3, 89.90, 45.00),
                ($1, 'product', 'Calça Jeans', $2, $3, 149.90, 75.00)
        `,
            [companyId, categoryId, unitId]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const company = await queryRunner.query(
            `SELECT "id" FROM "companies" WHERE "cnpj" = '12.148.983/0001-97'`
        );

        const companyId = company[0].id;

        await queryRunner.query(
            `DELETE FROM "products" WHERE "company_id" = $1 AND "name" IN ('Camiseta Manga Longa', 'Calça Jeans')`,
            [companyId]
        );

        await queryRunner.query(
            `DELETE FROM "categories" WHERE "company_id" = $1 AND "name" = 'Roupas'`,
            [companyId]
        );
    }
}
