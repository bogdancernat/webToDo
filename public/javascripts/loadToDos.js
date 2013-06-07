var socketToDos = io.connect('http://localhost:3000/toDos');
$(document).ready(function() {
    socketToDos.emit('giveMeToDos', {});
    socketToDos.on('takeToDos', function (data){
        var length = data.toDos.length;

        for (var counter = 0; counter < length; counter++) {
            var priority;
            var todoItemWrapper = $('<div>', {class: 'todoItemWrapper', id: data.toDos[counter].value.uniqueId});
            var todoitemDiv = $('<div>', {class: 'todoItem'});
            var todoItemXPandDiv;
            var todoContentDiv = $('<div>', {class: 'toDoContent'});
            var todoDateTimeDiv = $('<div>', {class: 'toDoDateTime'});
            var progressDiv;
            var contentPar = $('<p>');
            var dueDatePar = $('<p>');
            var advancedOpt = $('<div>', {class: 'toDoAdvancedOpt'});
            var span = $('<span>');
            var todoDone = 'notDone';
            todoItemXPandDiv = $('<div>', {class: 'todoItemXPand'});
            progressDiv = $('<div>', {class: 'progress'});

            
            contentPar.text(data.toDos[counter].value.todo);

            if (data.toDos[counter].value.duedate != null)
                dueDatePar.text(data.toDos[counter].value.duedate);
            else
                dueDatePar.text('no due date');

            switch (data.toDos[counter].value.priority) {
                case 'low':
                    priority = 'lowPriority';
                    break;
                case 'medium':
                    priority = 'mediumPriority';
                    break;
                case 'high':
                    priority = 'highPriority';
                    break;
                case 'done':
                    todoDone = 'todoDone'; 
                    todoItemXPandDiv = $('<div>', {class: 'toDoDone todoItemXPand'});
            }

            span.html('&rang;');

            todoItemXPandDiv.append(span);

            todoContentDiv.append(contentPar);

            todoDateTimeDiv.append(dueDatePar);

            progressDiv.text(data.toDos[counter].value.percentage);

            todoitemDiv.append(todoItemXPandDiv);
            todoitemDiv.append(todoContentDiv);
            todoitemDiv.append(todoDateTimeDiv);
            todoitemDiv.append(progressDiv);
            console.log(data.toDos[counter].value.notes);
            var notesElements = '';
            for (var i = data.toDos[counter].value.notes.length - 1; i >= 0; i--) {
                notesElements += '<li class="todoNote"><span class="deleteToDoNote">x</span>'+ data.toDos[counter].value.notes[i]+'</li>';
            };
            
            advancedOpt.append('<span class="todoDelete todoDeleteLocked"></span>'
                +'<div class="todoOptions">'
                    +'<span class="changePriority"></span>'
                    +'<span class="markDone todoDone">done</span>'
                    +'<input class="todoProgress" type="range" min="0" max="100" step="25" value="' + data.toDos[counter].value.percentage + '"/>'
                +'</div>'
                +'<div class="todoNotesWrapper">'
                    +'<input type="text" class="addToDoNoteInput"/>'
                    +'<ul>'
                        + notesElements
                    +'</ul>'
                +'</div>'
                );
            todoItemWrapper.append(todoitemDiv);
            todoItemWrapper.append(advancedOpt);

            $('#todosContainer').prepend(todoItemWrapper);

            if (todoDone === 'todoDone')
                priority = 'no priority';

            changePriorityToDo(data.toDos[counter].value.uniqueId, priority);

            if(todoDone === 'todoDone'){
                markToDoDone(data.toDos[counter].value.uniqueId);
            }
        }
    });



});