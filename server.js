'use strict';
require('dotenv').config()

const express = require('express');
const app = express();
const port = 3000;

const pg = require('pg');
const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const prefix = "!";

pgClient.connect();



/*
`SELECT * from prompts LIMIT 1`;

//let query = `INSERT INTO leader (name, discordid, serverid, idhash) VALUES ($1, $2, $3, $4) ON CONFLICT (idhash) DO UPDATE SET count = leader.count + 1;`
//let values = [name, discordid, serverid, idhash];
console.log(`${name} got a react`);
pgClient.query(query, values, (err, res) => {
    if (err) throw err;
});
*/



app.get('/', function(req, res) {
    res.send("hello world");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
