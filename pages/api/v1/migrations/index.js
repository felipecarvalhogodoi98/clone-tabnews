import { join } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

export default async function migrations(req, res) {
  const { method } = req;

  const client = await database.getNewClient();

  const migrationsDir = join("infra", "migrations");
  const defaultMigrationOptions = {
    dbClient: client,
    dir: migrationsDir,
    direction: "up",
    dryRun: true,
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (method === "POST") {
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await client.end();

    if (migrations.length > 0) {
      return res.status(201).json(migrations);
    }

    return res.status(200).json(migrations);
  }

  if (method === "GET") {
    const penddingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
    });

    await client.end();
    return res.status(200).json(penddingMigrations);
  }

  return res.status(405).json({ message: "Method not allowed" }).end();
}
