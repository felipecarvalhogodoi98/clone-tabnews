import database from "infra/database";

beforeAll(async () => {
  await database.query("DROP SCHEMA public CASCADE;CREATE SCHEMA public;");
});

describe("GET /api/v1/migrations", () => {
  it("GET /api/v1/migrations should return 200", async () => {
    const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "POST",
    });
    expect(response1.status).toBe(201);

    const data = await response1.json();
    expect(data.length).toBeGreaterThan(0);

    const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "POST",
    });
    expect(response2.status).toBe(200);

    const response2Data = await response2.json();
    expect(response2Data.length).toBe(0);
  });
});
