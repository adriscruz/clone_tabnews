import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersionResult.rows[0].server_version;

  const maxConnectionDb = await database.query("SHOW max_connections;");
  const maxConnectionDbValue = maxConnectionDb.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const dbOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const dbOpenedConnectionsResultValue = dbOpenedConnectionsResult.rows.length;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: parseInt(maxConnectionDbValue),
        opened_connections: dbOpenedConnectionsResultValue,
      },
    },
  });
}

export default status;
