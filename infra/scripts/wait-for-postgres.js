const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", check);

  function check(error, stdout) {
    if (stdout.includes("accepting connections")) {
      process.stdout.write("\n\n✅ Postgres is ready!\n\n");
      return;
    }

    process.stdout.write(".");
    setTimeout(checkPostgres, 100);
  }
}

console.log("Waiting for Postgres...");
checkPostgres();
