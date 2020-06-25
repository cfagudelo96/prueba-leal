import { join } from 'path';

export = {
  type: 'sqlite',
  entities: [join(__dirname, 'src/**/**.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  database: join(__dirname, 'data/db.sqlite'),
  cli: {
    migrationsDir: 'migrations',
  },
};
