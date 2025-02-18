const Redis = require("ioredis");
const dotenv=require('dotenv').config()

const client = new Redis({
    host: process.env.HOST,
    port: 14746,
    password: process.env.PASSWORD,

});

client.on('connect', () => {
    console.log('Redis connected')
})
client.on('error', err => console.log('Redis Client Error', err));


module.exports = client