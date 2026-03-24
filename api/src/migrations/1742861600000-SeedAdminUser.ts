import { MigrationInterface, QueryRunner } from 'typeorm';
import bcrypt from 'bcryptjs';

export class SeedAdminUser1742861600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash('admin', 10);

        await queryRunner.query(
            `
            INSERT INTO "users" ("name", "email", "password", "language", "role_id")
            VALUES ('Administrador', 'admin@lupart.com.br', $1, 'pt-BR', (SELECT "id" FROM "roles" WHERE "name" = 'admin' AND "company_id" IS NULL))
        `,
            [hashedPassword]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "users" WHERE "email" = 'admin@lupart.com.br'`);
    }
}
