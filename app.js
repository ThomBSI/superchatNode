var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),
    fs = require('fs');

app.get('/',function(req,res) {
    res.sendFile(__dirname + '/chat.html');
});

io.sockets.on('connect',function(socket) {
    socket.on('new.user',function(pseudo) {
        if (pseudo === null) {
            pseudo = ' ';
        }
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new.user.broadcast',pseudo);
    });
    socket.on('new.message',function(message) {
        message = ent.encode(message);
        socket.broadcast.emit('new.message.broadcast',{pseudo:socket.pseudo, message:message});
    });
    socket.on('exit.user',function(pseudo) {
        socket.broadcast.emit('exit.user.broadcast',pseudo);
    });
});

server.listen(8080);
