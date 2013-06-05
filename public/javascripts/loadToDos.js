$(document).ready(function() {
	var socket = io.connect('http://localhost:3000/toDos');
	

	function getId() {
		var cookJson = getCookie('todo_id_in');
		var id;

		if (!cookJson) {
		    cookJson = getCookie('todo_memory');

		    if (!cookJson)
		        return null;

		    return (cookJson?cookJson._id:null);	
		}
		 
	    return (cookJson?cookJson._id:null);	
	}
	


	socket.emit('giveMeToDos', { _id: getId() });

	socket.on('takeToDos', function (data){
		/*var length = data.length;

		for (var counter = 0; counter < length; counter++) {
			console.log(data[counter]);
		}*/

		console.log(data);
	});

});