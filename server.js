const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const routes = require('./routes/v1');
require("dotenv").config();

app.use(express.json());

const PORT = process.env.PORT || 8000;

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
console.log("Mongodb connection success!!!");
})

// v1 api routes
app.use('/api/v1', routes);

app.get("/",(req,res)=>{
    res.json("server started")
})

app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`)
})