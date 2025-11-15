import { defineConfig, env } from 'prisma/config';

const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://simplicity:simplicity@db:5432/simplicity_db';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: databaseUrl,
  },
});
