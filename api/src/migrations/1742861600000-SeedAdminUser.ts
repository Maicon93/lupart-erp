import { MigrationInterface, QueryRunner } from 'typeorm';
import bcrypt from 'bcryptjs';

export class SeedAdminUser1742861600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash('admin', 10);

        await queryRunner.query(
            `
            INSERT INTO "users" ("name", "email", "password", "role_id")
            VALUES ('Administrador', 'admin@lupart.com.br', $1, (SELECT "id" FROM "roles" WHERE "name" = 'admin' AND "company_id" IS NULL))
        `,
            [hashedPassword]
        );

        const admin = await queryRunner.query(
            `SELECT "id" FROM "users" WHERE "email" = 'admin@lupart.com.br'`
        );

        await queryRunner.query(
            `
            INSERT INTO "user_profiles" ("user_id", "phone", "country")
            VALUES ($1, '(00) 00000-0000', 'Brasil')
        `,
            [admin[0].id]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const admin = await queryRunner.query(
            `SELECT "id" FROM "users" WHERE "email" = 'admin@lupart.com.br'`
        );

        if (admin.length > 0) {
            await queryRunner.query(`DELETE FROM "user_profiles" WHERE "user_id" = $1`, [admin[0].id]);
        }

        await queryRunner.query(`DELETE FROM "users" WHERE "email" = 'admin@lupart.com.br'`);
    }
}
