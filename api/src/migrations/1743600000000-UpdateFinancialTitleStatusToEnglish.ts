import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFinancialTitleStatusToEnglish1743600000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "financial_titles" SET "status" = 'pending' WHERE "status" = 'pendente'`);
        await queryRunner.query(`UPDATE "financial_titles" SET "status" = 'paid' WHERE "status" = 'pago'`);
        await queryRunner.query(`UPDATE "financial_titles" SET "status" = 'cancelled' WHERE "status" = 'cancelado'`);
        await queryRunner.query(`ALTER TABLE "financial_titles" ALTER COLUMN "status" SET DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "financial_titles" ALTER COLUMN "status" SET DEFAULT 'pendente'`);
        await queryRunner.query(`UPDATE "financial_titles" SET "status" = 'pendente' WHERE "status" = 'pending'`);
        await queryRunner.query(`UPDATE "financial_titles" SET "status" = 'pago' WHERE "status" = 'paid'`);
        await queryRunner.query(`UPDATE "financial_titles" SET "status" = 'cancelado' WHERE "status" = 'cancelled'`);
    }
}
