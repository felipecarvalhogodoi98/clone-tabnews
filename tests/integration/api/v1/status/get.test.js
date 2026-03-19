describe("GET /api/v1/status", () => {
  it("should return the status of the application", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    expect(response.status).toBe(200);

    const data = await response.json();

    const updateAt = new Date(data.update_at);
    const now = new Date();
    const diff = now.getTime() - updateAt.getTime();
    const diffInSeconds = diff / 1000;
    expect(diffInSeconds).toBeLessThan(1000);

    const database = data.dependencies.database;
    expect(database.version).toBe("16.0");
    expect(database.max_connections).toBe(100);
    expect(database.opened_connections).toBe(1);
  });
});
