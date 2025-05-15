import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: 'int',
    },
    title: {
      type: 'varchar',
    },
    poster_path: {
      type: 'varchar',
      nullable: true
    },
    vote_average: {
      type: 'float',
      nullable: true
    },
    release_date: {
      type: 'varchar',
      nullable: true
    }
  }
});

export default Movie;
