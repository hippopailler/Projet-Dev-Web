import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class CreateMovie1744709507658 {
    name = 'CreateMovie1744709507658'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "release_date" TIMESTAMP,
                CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
    }
}
