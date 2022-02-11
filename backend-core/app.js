require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
app.use(cors());

// Point static path to dist
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

// Set our api routes
require('./controller/route.controller.js')(app, bunyanLogger);

var server = app.listen(process.env.PORT || 8080,function(){
  console.log("App listening at 8080");
});
