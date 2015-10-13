module.exports = function Route(app, server){

	var io = require('socket.io').listen(server);

	var messages

	if (messages === undefined) {
		messages = [];
	}
	
	var users = [];
	var current_user

	app.get('/', function (req, res) {
		res.render('index');
	})


	io.sockets.on('connection', function(socket) {

		console.log('connected with ID: '+socket.id);


		socket.on('adding_user', function(data) {
			console.log('recieved from front-end: '+data.name)

			var new_user = {
				name: data.name,
				id: socket.id
			}

			current_user = new_user;

			users.push(new_user);

			console.log("Here's the user array: "+users)
			
			socket.broadcast.emit("user_added", {user: new_user});

			socket.emit("welcome", {
				messages: messages,
				user: new_user
			});

		});

		socket.on("new_message", function(data){
			console.log("Serverside: "+data.message+" -- "+data.author);
			messages.push(data);
			console.log('Messages array: '+messages)
			io.emit("message_added", {
				message: data
			})
		})

		socket.on('disconnect', function(){
			
			console.log('Disconnected ID: '+socket.id);

			// socket.broadcast.emit("disconnected_user", {data: id});
		});
	})

};