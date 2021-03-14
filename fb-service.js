"use strict";
// Node Modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

// App Modules
const routes = require("./fb-routes");

// Set up app
const app = express();

// CORS
app.use(cors());

// parse incoming requests application/json
app.use(bodyParser.json());
// parse incoming requests application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true }))

// diskdb connection
global.db = require('diskdb');
global.db.connect('./data', ['users']);

// include routes
app.use("/api/v1", routes);

const port = 4000;

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});

