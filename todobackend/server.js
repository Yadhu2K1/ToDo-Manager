require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors({ methods: "GET,POST,PUT,DELETE" }));
app.use(express.json());

mysql
  .createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .then((connection) => {
    console.log("Successfully connected to MySQL database!");
    app.locals.connection = connection;

    app.use("/user", require("./Routing/user"));
    app.use("/project", require("./Routing/project"));
    app.use("/todo", require("./Routing/todo"));

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something broke!");
    });

    const port = 5000; 
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1);
  });
