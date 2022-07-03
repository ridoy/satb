'use strict';
require('dotenv').config()

const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT;

const pg = require('pg');
const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const prefix = "!";

pgClient.connect();


app.use(express.static('public'));


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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/prompt', function(req, res) {
    res.send("Hello world");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
