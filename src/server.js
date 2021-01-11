/* eslint-disable no-console */
/* eslint-disable quotes */
const knex = require("knex");
const app = require("./app");
const { PORT, DB_URL } = require("./config");

const db = knex({
  client: "pg",
  connection: "DB_URl",
});
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
