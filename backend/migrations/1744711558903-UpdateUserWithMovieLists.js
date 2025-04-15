import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class UpdateUserWithMovieLists1744711558903 {
    name = 'UpdateUserWithMovieLists1744711558903'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "release_date" TIMESTAMP,
                CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_liked_movies_movie" (
                "userId" character varying NOT NULL,
                "movieId" integer NOT NULL,
                CONSTRAINT "PK_7adad71ba92731c7625fd2c328c" PRIMARY KEY ("userId", "movieId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_bc3a33713de6afdb5341a6b7ed" ON "user_liked_movies_movie" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_7e9e044f0c163523168bbcf399" ON "user_liked_movies_movie" ("movieId")
        `);
        await queryRunner.query(`
            CREATE TABLE "user_watch_later_movies_movie" (
                "userId" character varying NOT NULL,
                "movieId" integer NOT NULL,
                CONSTRAINT "PK_29d7d36edc363b9f6af60bca3cd" PRIMARY KEY ("userId", "movieId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_bcb5f693a0c3a6d7dd8953bc08" ON "user_watch_later_movies_movie" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_529b136db8de25687b1ba7888a" ON "user_watch_later_movies_movie" ("movieId")
        `);
        await queryRunner.query(`
            CREATE TABLE "user_watched_movies_movie" (
                "userId" character varying NOT NULL,
                "movieId" integer NOT NULL,
                CONSTRAINT "PK_77f4b1d555a0f485bab6b20edae" PRIMARY KEY ("userId", "movieId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_57c602c7ce418117188ea3dbb3" ON "user_watched_movies_movie" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_7e9b8d6ee53233664f40672934" ON "user_watched_movies_movie" ("movieId")
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_liked_movies_movie"
            ADD CONSTRAINT "FK_bc3a33713de6afdb5341a6b7ed5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_liked_movies_movie"
            ADD CONSTRAINT "FK_7e9e044f0c163523168bbcf3993" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_watch_later_movies_movie"
            ADD CONSTRAINT "FK_bcb5f693a0c3a6d7dd8953bc081" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_watch_later_movies_movie"
            ADD CONSTRAINT "FK_529b136db8de25687b1ba7888a1" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_watched_movies_movie"
            ADD CONSTRAINT "FK_57c602c7ce418117188ea3dbb3f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_watched_movies_movie"
            ADD CONSTRAINT "FK_7e9b8d6ee53233664f406729343" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user_watched_movies_movie" DROP CONSTRAINT "FK_7e9b8d6ee53233664f406729343"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_watched_movies_movie" DROP CONSTRAINT "FK_57c602c7ce418117188ea3dbb3f"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_watch_later_movies_movie" DROP CONSTRAINT "FK_529b136db8de25687b1ba7888a1"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_watch_later_movies_movie" DROP CONSTRAINT "FK_bcb5f693a0c3a6d7dd8953bc081"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_liked_movies_movie" DROP CONSTRAINT "FK_7e9e044f0c163523168bbcf3993"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_liked_movies_movie" DROP CONSTRAINT "FK_bc3a33713de6afdb5341a6b7ed5"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7e9b8d6ee53233664f40672934"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_57c602c7ce418117188ea3dbb3"
        `);
        await queryRunner.query(`
            DROP TABLE "user_watched_movies_movie"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_529b136db8de25687b1ba7888a"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_bcb5f693a0c3a6d7dd8953bc08"
        `);
        await queryRunner.query(`
            DROP TABLE "user_watch_later_movies_movie"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7e9e044f0c163523168bbcf399"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_bc3a33713de6afdb5341a6b7ed"
        `);
        await queryRunner.query(`
            DROP TABLE "user_liked_movies_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
    }
}
