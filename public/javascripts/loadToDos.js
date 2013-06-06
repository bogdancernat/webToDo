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
        var length = data.toDos.length;

        for (var counter = 0; counter < length; counter++) {
            var todoitemDiv = $('<div>', {class: 'todoItem'});
            var todoItemXPandDiv;
            var todoContentDiv = $('<div>', {class: 'toDoContent'});
            var todoDateTimeDiv = $('<div>', {class: 'toDoDateTime'});
            var progressDiv = $('<div>', {class: 'progress highPriority'});
            var contentPar = $('<p>');
            var dueDatePar = $('<p>');
            var dueTimePar = $('<p>');
            var span = $('<span>');

            
            contentPar.text(data.toDos[counter].value.todo);

            if (data.toDos[counter].value.duedate != null)
                dueDatePar.text(data.toDos[counter].value.duedate);
            else
                dueDatePar.text('nu due date');
            if (data.toDos[counter].value.duetime != null)
                dueTimePar.text(data.toDos[counter].value.duetime);
            else
                dueTimePar.text('nu due time');
            
            switch (data.toDos[counter].value.priority) {
                case 'low':
                    todoItemXPandDiv = $('<div>', {class: 'lowPriority todoItemXPand'});
                    break;
                case 'medium':
                    todoItemXPandDiv = $('<div>', {class: 'mediumPriority todoItemXPand'});
                    break;
                case 'high':
                    todoItemXPandDiv = $('<div>', {class: 'highPriority todoItemXPand'});
            }

            span.html('&rang;');

            todoItemXPandDiv.append(span);

            todoContentDiv.append(contentPar);

            todoDateTimeDiv.append(dueDatePar);
            todoDateTimeDiv.append(dueTimePar);

            progressDiv.text(90);

            todoitemDiv.append(todoItemXPandDiv);
            todoitemDiv.append(todoContentDiv);
            todoitemDiv.append(todoDateTimeDiv);
            todoitemDiv.append(progressDiv);

            $('#todosContainer').append(todoitemDiv);    
        }

        


    });



});