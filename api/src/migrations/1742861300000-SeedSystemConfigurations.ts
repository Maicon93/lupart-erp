import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSystemConfigurations1742861300000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "system_configurations" ("key", "value")
            VALUES
                ('access_token_duration', '15'),
                ('refresh_token_duration', '7'),
                ('max_upload_size', '5')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "system_configurations"
            WHERE "key" IN ('access_token_duration', 'refresh_token_duration', 'max_upload_size')
        `);
    }
}
