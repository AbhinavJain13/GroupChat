module.exports = function Route(app, server){

	var io = require('socket.io').listen(server);

	var messages

	if (messages === undefined) {
		messages = [];
	}

	var users = [];

	app.get('/', function (req, res) {
		res.render('index');
	})


	io.sockets.on('connection', function(socket) {

		console.log('connected with ID: '+socket.id);


		socket.on('adding_user', function(data) {

			var new_user = {
				name: data.name,
				id: socket.id
			}

			users.push(new_user);
			
			socket.broadcast.emit("user_added", {user: new_user, users: users});

			socket.emit("welcome", {
				messages: messages,
				user: new_user
			});

			io.emit("fill_user_table", {users: users})

		});

		socket.on("new_message", function(data){
			for (user in users) {
				if (users[user].id === socket.id){
					var message = {
						message: data.message,
						author: users[user].name
					}
					break;
				}
			}

			messages.push(message);

			io.emit("message_added", {
				message: message
			})
		})

		socket.on('disconnect', function(){
			console.log('Disconnected ID: '+socket.id);
			
			for (user in users){
				if(users[user].id === socket.id){
					var lost_user = users[user].name
					users.splice(users[user],1);
					break;
				}
			}
			io.emit("user_left", {user: lost_user})
			io.emit("fill_user_table", {users: users})
		});
	})

};