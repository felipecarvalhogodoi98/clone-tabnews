import { join } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

export default async function migrations(req, res) {
  const { method } = req;

  const allowedMethods = ["POST", "GET"];
  if (!allowedMethods.includes(method)) {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrationsDir = join("infra", "migrations");
    const defaultMigrationOptions = {
      dbClient,
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

      if (migrations.length > 0) {
        res.status(201).json(migrations);
      }

      res.status(200).json(migrations);
    }

    if (method === "GET") {
      const penddingMigrations = await migrationRunner({
        ...defaultMigrationOptions,
      });

      res.status(200).json(penddingMigrations);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await dbClient.end();
  }
}
