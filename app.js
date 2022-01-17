let instana = require('@instana/collector')({
  serviceName: process.env.INSTANA_SERVICE_NAME,
  agentHost: process.env.INSTANA_AGENT_HOST,
  reportUncaughtException: true
});

require('dotenv').config();
let bunyan = require('bunyan');
// Create your logger(s).
let bunyanLogger = bunyan.createLogger({name: process.env.INSTANA_SERVICE_NAME});
// Set the logger Instana should use.
instana.setLogger(bunyanLogger);

require('lightrun').start({
  lightrunSecret: '743fd029-7c64-4e38-9902-fe037c7cd788',
  company: 'icp4aeliteteam',
});

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
app.use(express.static(path.join(__dirname, '/dist')));
app.use('/web/*', express.static(path.join(__dirname, '/dist')));
app.use('/web', express.static(path.join(__dirname, '/dist')));
app.use(bodyParser.urlencoded({ extended: true }));

// Set our api routes
require('./controller/route.controller.js')(app, bunyanLogger);

var server = app.listen(process.env.PORT || 8080,function(){
  console.log("App listening at 8080");
});
