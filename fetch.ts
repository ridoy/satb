import { Client } from 'twitter-api-sdk';
var fs = require('fs');
const client = new Client("AAAAAAAAAAAAAAAAAAAAAMQ9dwEAAAAArPHWPc8stNm93U2PWKJZGXf1Ezc%3DKnySwYXSvSF0kvwXppT3l2nnIUyO24vIDQVHUIekuDTfc93qD0");
async function main() {
    for(let i = 0; i <= 10; i++) {
        let resultSet = await client.tweets.tweetsRecentSearch({
            query: `she's a ${i}`,
            max_results: 100,
            expansions: ['author_id'],
            "user.fields": ['username']
        });

        resultSet.data?.forEach(tweet => {
   
            if (tweet.text.substring(0,5).toLowerCase() === "hes a") {
                console.log(tweet.text);

            } else if (tweet.text.substring(0,6).toLowerCase() === "he's a") {
                console.log(tweet.text);

            } else if (tweet.text.substring(0,6).toLowerCase() === "shes a") {
                console.log(tweet.text);

            } else if (tweet.text.substring(0,7).toLowerCase() === "she's a") {
                console.log(tweet.text);

            }
        })
        
    }
}

main();
