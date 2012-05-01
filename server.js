(function() {
  var express, server;
  express = require("express");
  server = express.createServer();
  server.use(express.static(__dirname));
  server.get("/", function(req, res) {
    return res.end("hello");
  });
  server.post('/getaccesstoken', function(req, res) {
    return res.end("hello");
  });
  server.listen(3000);
}).call(this);
