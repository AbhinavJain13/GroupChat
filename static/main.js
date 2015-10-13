$(document).ready(function (){
	console.log('Document ready');
	$(".chat").hide();
	var socket = io.connect();

		$('#new').submit(function(){
		console.log('Posted form')
		
		socket.emit("adding_user", {
			name: $("#name").val(),
		})

		$(".form").hide();
		$(".chat").show();
		return false;
	})

	//Letting other users know about new user

	socket.on("user_added", function(data){
		console.log('added user and recieved from server:'+data);
		console.log(data.user.name)
		var new_user_name = data.user.name

		$("#chatroom").append("<li>"+new_user_name+" joined the chat!</li>")
	})

	//Welcoming new user

	socket.on("welcome", function(data){
		console.log(data.user.name)
		console.log(data.user.id)
		console.log("Here are the messages: "+data.messages)
		
		$("#id_holder").val(data.user.id);
		$("#name_holder").val(data.user.name);

		var html = '';
		for (message in data.messages){
			html += "<li><span class = 'author'>"+data.messages[message].author+" says: </span> <span class='message_text'>"+data.messages[message].message+"</span></li>"
		}
		html += '<li>Welcome!</li>'
		console.log(html)

		$("#chatroom").empty().append(html);

	})

	$("#new_message").submit(function() {
		var message = $("#message").val()
		var author = $("#name_holder").val()

		console.log("New message: "+message+" Author: "+author);

		socket.emit("new_message", {
			message: message,
			author: author
		})
		return false;
	})

	socket.on("message_added", function(data){
		console.log(data.message)
		var message = data.message.message
		var author = data.message.author

		$("#chatroom").append("<li><span class = 'author'>"+author+" says: </span> <span class='message_text'>"+message+"</span></li>")
		
	})















	socket.on('chatroom_alert', function(data) {
		console.log(data.data.name)
		console.log(data.data.id)
		var html = "<div id = "+data.data.id+" class = 'col-xs-3 user'><h3>"+data.data.name+"</h3></div>"
		$(html).appendTo(".users").hide().fadeIn("slow");
	})

	socket.on('disconnected_user', function(data) {
		console.log(data.data);
		$("#"+data.data).fadeOut("slow");
	})



})