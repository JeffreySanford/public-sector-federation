import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const databaseUrl =
  process.env['DATABASE_URL'] ?? 'postgresql://public_sector:public_sector@localhost:5432/public_sector_agile?schema=public';

export default defineConfig({
  schema: 'apps/agile-api/prisma/schema.prisma',
  migrations: {
    path: 'apps/agile-api/prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
