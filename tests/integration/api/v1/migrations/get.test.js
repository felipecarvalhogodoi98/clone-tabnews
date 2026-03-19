import database from "infra/database";

beforeAll(async () => {
  await database.query("DROP SCHEMA public CASCADE;CREATE SCHEMA public;");
});

describe("GET /api/v1/migrations", () => {
  it("GET /api/v1/migrations should return 200", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations");
    expect(response.status).toBe(200);

    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});
