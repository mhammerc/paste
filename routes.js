var resolver = require('./resolver.js');
var express = require('express');
var jade = require('jade');
var app = express();
var http = require('http').Server(app);
var pasteStoreDir = "./pastes/";
var room = require('./room');

resolver.register("app", app);
resolver.register("http", http);
resolver.register("pasteStoreDir", pasteStoreDir);
resolver.register("jade", jade);

app.use(express.static('./public'));

app.get('/', function(req,res){
    res.send("Welcome ! Now select a room :-) !");
});

app.get('/:room', room.index);

var server = http.listen(3000, function () {
    var port = server.address().port;
    console.log('listening on *:%s', port);

    var io = require('socket.io')(http);
    resolver.register("io", io);
    room.init();
});

