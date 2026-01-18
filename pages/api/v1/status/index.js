import database from "../../../../infra/database";

const status = async (req, res) => {
  const result = await database.query("SELECT 1 + 1 as SUM;");
  console.log(result.rows);
  res.status(200).send({ status: "ok" });
}

export default status;