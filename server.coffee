express = require "express"

server=express.createServer()

server.use express.static __dirname

server.get "/",(req,res)->
	res.end "hello"

server.post '/getaccesstoken',(req,res)->
	res.end "hello"
server.listen 3000
