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

const sslRedirect = require('heroku-ssl-redirect');
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
app.use(sslRedirect());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/prompt', function(req, res) {
    let preference = req.query.pref;
    if (!preference) {
        console.log("[ERROR] For some reason req.query.pref was not defined.")
    }
    let query = `select * from prompts where pref=$1 order by random() limit 1;`; // I know this is bad but the database is small atm.
    let values = [preference];
 
    if (preference === "both") {
        query = `select * from prompts order by random() limit 1;`;
        values = [];
    }
    pgClient.query(query, values, (err, data) => {
        if (err) throw err;
        return res.send(data.rows);
    });
});

app.get('/vote', function(req, res) {
    let promptId = req.query.promptId;
    let rating = req.query.rating;
    let ratings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]; 
    if (!ratings.includes(rating)) { // pg doesn't support col names as parameters, so sanitize the input manually
        console.log(`[ERROR] There was a problem with voting at ${req.originalUrl}. Invalid rating ${rating} was provided.`);
        return res.status(500).send("There was a problem with your request, please try again later.");
    }
    if (!promptId || !rating) {
        console.log(`[ERROR] There was a problem with voting at ${req.originalUrl}. Either promptId or rating are undefined: ${promptId} ${rating}`);
        return res.status(500).send("There was a problem with your request, please try again later.");
    }
    let query = `UPDATE prompts set "${rating}" = "${rating}" + 1 where id=$1`;
    let values = [promptId];
    pgClient.query(query, values, (err, data) => {
        if (err) throw err;
        return res.send(data);
    });
});

app.get('/submit', function(req, res) {
    console.log(req.query);
    let gender = req.query.gender;
    let rating = req.query.rating;
    let prompt = req.query.prompt;

    let query = `insert into submissions (gender, rating, text) values ($1, $2, $3)`
    let values = [gender, rating, prompt]
    pgClient.query(query, values, (err, data) => {
        if (err) throw err;
        return res.send(data);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
