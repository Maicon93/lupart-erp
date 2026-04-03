import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAccessPlans1742861200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "access_plans" ("title", "user_limit", "duration_days", "price")
            VALUES
                ('Vitalício', 999, 9999, 0.00),
                ('Básico', 2, 30, 130.00),
                ('Enterprise', 10, 30, 250.00)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "access_plans" WHERE "title" IN ('Vitalício', 'Básico', 'Enterprise')`);
    }
}
