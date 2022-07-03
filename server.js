'use strict';
/*
 * SATB Server
 *
 * v1 Functionality:
 * Prompt: fetch a prompt from DB
 * Vote: increment counter for a rating for a prompt in the DB
 * Submit: store user-submitted prompts in a separate table for evaluation
 */ 
require('dotenv').config()

const path = require('path');
const express = require('express');
const app = express();
const pg = require('pg');
const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const port = process.env.PORT;

pgClient.connect();
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/prompt', function(req, res) {
    let query = `SELECT * from prompts LIMIT 1`;
    pgClient.query(query, (err, data) => {
        if (err) throw err;
        res.send(data.rows);
    });
});

app.get('/vote', function(req, res) {
    let query = `SELECT * from prompts LIMIT 1`;
    pgClient.query(query, (err, data) => {
        if (err) throw err;
        res.send(data.rows);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
