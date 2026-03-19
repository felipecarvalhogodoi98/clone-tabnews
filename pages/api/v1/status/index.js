import database from "infra/database";

export default async function status(req, res) {
  const updateAt = new Date().toISOString();
  const postgresVersionQuery = await database.query("SHOW server_version;");
  const postgresVersion = postgresVersionQuery.rows[0].server_version;

  const postgresMaxConnectionsQuery = await database.query(
    "SELECT current_setting('max_connections')::int AS max_connections;",
  );
  const postgresMaxConnections =
    postgresMaxConnectionsQuery.rows[0].max_connections;

  const postgresOpenedConnectionsQuery = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });
  const postgresOpenedConnections =
    postgresOpenedConnectionsQuery.rows[0].count;

  res.status(200).send({
    update_at: updateAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: postgresMaxConnections,
        opened_connections: postgresOpenedConnections,
      },
    },
  });
}
