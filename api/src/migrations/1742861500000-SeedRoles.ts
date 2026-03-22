import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1742861500000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "roles" ("name", "description")
            VALUES
                ('admin', 'Administrador global do sistema'),
                ('user', 'Usuário de empresa')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "roles" WHERE "name" IN ('admin', 'user') AND "company_id" IS NULL`);
    }
}
