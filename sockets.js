module.exports = function(app, server){

    var User = require("./models/User"),
        log = require("debug")("Dinpo:socket"),
        log_error = require("debug")("Dinpo:socket:error"),
        config = app.get("config"),
        passport = require("passport");



    log("Initializing Socket.io server");
    var io = require("socket.io")(server, {});




    /**
     * Configuring Socket.io handshake
     */
    io.use(function(socket, next){
        // Wrap the express middleware
        app.get("sessionMiddleware")(socket.request, {}, next);
    });


    var _admins = {};

    User.find({}, function(err, users){
        for(var id in users){
            var user = users[id];

            _admins[id] = {
                online: false,
                sockets: [],
                user: user
            }
        }
    });

    var threads = {};
    var _id = 0;

    var ADMIN_ROOM = "admin";

    io.on("connection", function(socket){



        log("%s connected", socket.id);

        var session = socket.request.session;
        socket.userId = session.passport ? session.passport.user : null;


        socket.on("chat: active", function(data){

            var id = data.id;
            var thread = threads[id];

            if(!thread)
                thread = threads[id] = {id: id, title: "Visitante #" + (++_id), messages:[],  sockets: [], page: data.page}
            thread.sockets.push(socket.id);

            io.to('admin').emit("thread: get one", parseThread(thread));

            socket.emit("admin: get all", getAllAdmins());

        });


        if(socket.userId){
            socket.join(ADMIN_ROOM);
        }

        socket.on("disconnect", () => {
            var thread = threads[socket.request.sessionID];
            if(thread){
                var index = thread.sockets.indexOf(socket.id);
                if(index >= 0)
                    thread.sockets.splice(index, 1);

                if(!thread.sockets || thread.sockets.length == 0){
                    delete threads[socket.request.sessionID];
                }
            }
        });

        socket.on("message: send", function(data){
            var thread = threads[data.threadID];

            if(!thread) return;

            thread.messages.push(data.message);


            if(data.from == 'client'){
                io.to('admin').emit('message: get one', {
                    message: data.message
                });
            }else{
                var thread = socket
                io.to(threads[data.threadID].sockets).emit('message: get one', {
                    message: data.message
                });
            }

        });

        socket.on("user: authenticate", function(user){
            var obj = {};
            if(user._id != socket.userId){
                obj.error = "The IDS don't match";
                socket.leave(ADMIN_ROOM);
            }else
                obj.user = user;

            socket.emit("user: authenticate", obj);
        });

        socket.on("thread: get all", () => io.to('admin').emit("thread: get all", parseThreads(threads)));



    });

    var object_values = obj => Object.keys(obj).map(key => obj[key]);

    function parseThread(thread){
        return {
            "id": thread.id,
            "title": thread.title,
            "page": thread.page,
            "messages": thread.messages
        };
    }

    function parseThreads(arr) {
        var threads = [];
        for(id in arr){
            var thread = arr[id];
            threads.push(parseThread(thread));
        };
        return threads;

    }

    function getAllAdmins() {
        var arr = [];
        for(var id in _admins){
            var user = _admins[id].user;
            arr.push({
                id: user._id,
                name: user.name,
                email: user.email
            });
        }
        return arr;
    }


};
