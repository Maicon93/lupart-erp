import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveLanguageToProfileAndAddTheme1742861900000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD COLUMN "language" varchar NOT NULL DEFAULT 'pt-BR',
            ADD COLUMN "theme" varchar NOT NULL DEFAULT 'light'
        `);

        await queryRunner.query(`
            UPDATE "user_profiles" up
            SET "language" = u."language"
            FROM "users" u
            WHERE up."user_id" = u."id"
        `);

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "language"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "language" varchar NOT NULL DEFAULT 'pt-BR'
        `);

        await queryRunner.query(`
            UPDATE "users" u
            SET "language" = up."language"
            FROM "user_profiles" up
            WHERE u."id" = up."user_id"
        `);

        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "theme"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "language"`);
    }
}
