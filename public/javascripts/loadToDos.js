$(document).ready(function() {
    var socket = io.connect('http://localhost:3000/toDos');
    

    function getId() {
        var cookJson = getCookie('todo_logged_in');

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
            var progressDiv;
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
                    progressDiv = $('<div>', {class: 'progress lowPriority'});
                    break;
                case 'medium':
                    todoItemXPandDiv = $('<div>', {class: 'mediumPriority todoItemXPand'});
                    progressDiv = $('<div>', {class: 'progress mediumPriority'});
                    break;
                case 'high':
                    todoItemXPandDiv = $('<div>', {class: 'highPriority todoItemXPand'});
                    progressDiv = $('<div>', {class: 'progress highPriority'});
                    break;
                case 'done':
                    todoItemXPandDiv = $('<div>', {class: 'toDoDone todoItemXPand'});
            }

            span.html('&rang;');

            todoItemXPandDiv.append(span);

            todoContentDiv.append(contentPar);

            todoDateTimeDiv.append(dueDatePar);
            todoDateTimeDiv.append(dueTimePar);

            progressDiv.text(data.toDos[counter].value.percentage);

            todoitemDiv.append(todoItemXPandDiv);
            todoitemDiv.append(todoContentDiv);
            todoitemDiv.append(todoDateTimeDiv);
            todoitemDiv.append(progressDiv);

            $('#todosContainer').append(todoitemDiv);    
        }
    });



});