import { MigrationInterface, QueryRunner } from 'typeorm';
import seedCompanyData from '../helpers/SeedCompanyData';

export class SeedCompanyAndLinkAdmin1742861700000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const adminUser = await queryRunner.query(
            `SELECT "id" FROM "users" WHERE "email" = 'admin@lupart.com.br'`
        );

        const accessPlan = await queryRunner.query(
            `SELECT "id" FROM "access_plans" WHERE "title" = 'Vitalício'`
        );

        await queryRunner.query(
            `
            INSERT INTO "companies" ("name", "cnpj", "access_plan_id", "responsible_id", "plan_expires_at")
            VALUES ('Lupart', '12.148.983/0001-97', $1, $2, '2050-12-31')
        `,
            [accessPlan[0].id, adminUser[0].id]
        );

        const company = await queryRunner.query(
            `SELECT "id" FROM "companies" WHERE "cnpj" = '12.148.983/0001-97'`
        );

        const companyId = company[0].id;

        await queryRunner.query(`UPDATE "users" SET "company_id" = $1 WHERE "email" = 'admin@lupart.com.br'`, [
            companyId,
        ]);

        await seedCompanyData(queryRunner.manager, companyId);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const company = await queryRunner.query(
            `SELECT "id" FROM "companies" WHERE "cnpj" = '12.148.983/0001-97'`
        );

        if (company.length > 0) {
            const companyId = company[0].id;
            await queryRunner.query(`DELETE FROM "suppliers" WHERE "company_id" = $1`, [companyId]);
            await queryRunner.query(`DELETE FROM "customers" WHERE "company_id" = $1`, [companyId]);
            await queryRunner.query(`DELETE FROM "categories" WHERE "company_id" = $1`, [companyId]);
            await queryRunner.query(`DELETE FROM "measurement_units" WHERE "company_id" = $1`, [companyId]);
            await queryRunner.query(`DELETE FROM "payment_types" WHERE "company_id" = $1`, [companyId]);
            await queryRunner.query(`DELETE FROM "company_settings" WHERE "company_id" = $1`, [companyId]);
        }

        await queryRunner.query(`UPDATE "users" SET "company_id" = NULL WHERE "email" = 'admin@lupart.com.br'`);
        await queryRunner.query(`DELETE FROM "companies" WHERE "cnpj" = '12.148.983/0001-97'`);
    }
}
