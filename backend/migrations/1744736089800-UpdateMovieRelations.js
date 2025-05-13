import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class UpdateMovieRelations1744736089800 {
    name = 'UpdateMovieRelations1744736089800'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD "poster_path" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
            ADD "overview" character varying
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie" DROP COLUMN "overview"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie" DROP COLUMN "poster_path"
        `);
    }
}
