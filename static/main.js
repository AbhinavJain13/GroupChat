$(document).ready(function (){
	console.log('Document ready');
	$(".chat").hide();
	$("#user_table").hide();
	var socket = io.connect();

		$('#new').submit(function(){
		console.log('Posted form')
		
		socket.emit("adding_user", {
			name: $("#name").val(),
		})

		$(".form").hide();
		$(".chat").show();
		$("#user_table").show();
		return false;
	})

	//Letting other users know about new user

	socket.on("user_added", function(data){

		var new_user_name = data.user.name

		$("#chatroom").append("<li class ='bg-danger'>"+new_user_name+" joined the chat!</li>")
	})

	//Welcoming new user

	socket.on("welcome", function(data){

		var html = '';
		for (message in data.messages){
			html += "<li><span class = 'bg-info'>"+data.messages[message].author+" says: </span> <span class='bg-warning'>"+data.messages[message].message+"</span></li>"
		}

		html += "<li class = 'bg-success center'>Welcome "+data.user.name+"!</li>"
		console.log(html)

		$("#chatroom").empty().append(html);

	})

	socket.on('fill_user_table', function(data){
		$("#user_list").html('');
		for (user in data.users) {
			$("#user_list").append('<li>'+data.users[user].name+'</li>');
		}
		$('#user_table').scrollTop($('#user_table')[0].scrollHeight);
	})

	socket.on('user_left', function(data){
		$("#chatroom").append("<li class = 'bg-danger'>"+data.user+" left the room.</li>");
	})

	$("#new_message").submit(function() {

		var message = $("#message").val()


		socket.emit("new_message", {
			message: message
		})
		$("#message").val('')
		return false;
	})

	socket.on("message_added", function(data){
		console.log(data.message)
		var message = data.message.message
		var author = data.message.author

		$("#chatroom").append("<li><span class = 'bg-info'>"+author+" says: </span> <span class='bg-warning'>"+message+"</span></li>")
		$('#chatroom').scrollTop($('#chatroom')[0].scrollHeight);
		
	})


})