const express = require('express')
const app = express();
var server = require('./lib/server');


app.use('/',(req,res) => {
  res.send("App is running");
});

app.listen(5000, () => {
  console.log("App is listening on port: 5000");
});










