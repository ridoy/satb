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

function addPrefToQuery(preference) {
    if (preference === "both") {
        return "";
    }
    return "pref=$1 and";
}

function queryIdExclusionBit(params, noPref) {
    if (params.length === 0) return "";
    if (noPref) return `where id not in (${params.join(',')})`;
    return `and id not in (${params.join(',')})`;
}
app.get('/prompt', function(req, res) {
    let ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
        req.socket.remoteAddress;
    let preference = req.query.pref;
    if (!preference) {
        console.log("[ERROR] For some reason req.query.pref was not defined.");
        preference = "both";
    }
    let seenIds = [];
    let params = [];
    if (req.query.seen) {
        seenIds = req.query.seen.split(",").map((id) => parseInt(id));
        if (preference === "both") {
            for (let i = 1; i < seenIds.length + 1; i++) {
                params.push('$' + i);
            }
        } else {
            for (let i = 2; i < seenIds.length + 2; i++) {
                params.push('$' + i);
            }
        }
    }
    // I know random() is bad but the database is small atm.
    let query = `select * from prompts where pref=$1 ${queryIdExclusionBit(params, false)} order by random() limit 1;`; 
    //console.log(query);
    let values = [preference].concat(seenIds);
 
    if (preference === "both") {
        query = `select * from prompts ${queryIdExclusionBit(params, true)} order by random() limit 1;`;
        
        values = seenIds;
        //console.log(query)
    }
    pgClient.query(query, values, (err, data) => {
        if (err) throw err;
        if (data.rows[0] && data.rows[0].text) {
            console.log("User with IP " + ip + " given prompt: " + data.rows[0].text);
        } else {
            console.log("User with IP " + ip + " has seen all prompts, none returned");
        }
        return res.send(data.rows);
    });
});

app.get('/vote', function(req, res) {
    let ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         req.socket.remoteAddress;
    let promptId = req.query.promptId;
    let rating = req.query.rating;
    if (promptId === "null" || rating === "null") {
        return res.status(400).send("Something went wrong, please try again.");
    }
    let ratings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "100"]; 
    if (!ratings.includes(rating)) { // pg doesn't support col names as parameters, so sanitize the input manually
        console.log(`[ERROR] There was a problem with voting at ${req.originalUrl}. Invalid rating ${rating} was provided.`);
        return res.status(500).send("There was a problem with your request, please try again later.");
    }
    if (!promptId || !rating) {
        console.log(`[ERROR] There was a problem with voting at ${req.originalUrl}. Either promptId or rating are undefined: ${promptId} ${rating}`);
        return res.status(500).send("There was a problem with your request, please try again later.");
    }
    let query = `UPDATE prompts set "${rating}" = "${rating}" + 1 where id=$1 returning prompts.text`;
    let values = [promptId];
    pgClient.query(query, values, (err, data) => {
        if (err) throw err;
        if (data.rows[0] && data.rows[0].text) {
            console.log("User with IP " + ip + " voted " + rating + " on: " + data.rows[0].text);
        }
        return res.send(data);
    });
});

app.get('/submit', function(req, res) {
    let ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         req.socket.remoteAddress;
    let gender = req.query.gender;
    let rating = req.query.rating;
    let prompt = req.query.prompt;

    let query = `insert into submissions (gender, rating, text) values ($1, $2, $3)`
    let values = [gender, rating, prompt]
    pgClient.query(query, values, (err, data) => {
        if (err) throw err;
        console.log("User with IP " + ip + " submitted " + prompt);
        return res.send(data);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
