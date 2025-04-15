import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    title: {
      type: String,
      nullable: false,
    },
    release_date: {
      type: Date,
      nullable: true,
    },
  },
});

export default Movie;
