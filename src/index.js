var express = require('express');
var mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
var app = express();
var url = process.env.DB_CONN_STRING;
mongoose.connect(url)
    .then(function () {
    console.log("Connected to the database");
})
    .catch(function (err) {
    console.log("Error connecting to the database", err);
});
app.listen(3030, function () {
    console.log("server running on http://localhost:8080/");
});
