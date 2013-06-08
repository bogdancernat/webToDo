var socket = io.connect('http://localhost:3000/shared')
  , selectedProject = "#untitled";

$(document).ready(function() {
    var loginSection = true
        , displayingSubmenu = false
        , isValidRegisterData = { '#passReg': false, '#confPassReg': false, '#emailReg': false};
    // $('#todosContainer').sortable();
    // $('#todosContainer').disableSelection();
    // fade in!
    socket.emit('giveMeNotifications', {});

    $('#loginButton').click(function(){
        $('#grayarea').css("display","block");
        $('#grayarea').fadeTo(200,1);
        $('#authWrapper').css("display","block");
        $('#authWrapper').animate({
            marginTop:'220px'
        },400);

        if (!loginSection){
            switchAuthForms();
    }});
    // fade out!
    $('#grayarea').click(function(){
        $('#authWrapper').animate({
            marginTop:'-320px'
        }, 400, function(){
            $('#authWrapper').css("display","none");
        });

        $('#grayarea').fadeTo(200, 0, function(){
            $('#grayarea').css("display","none");
        });
    });

    $('#authWrapper').click(function(e){
        e.stopPropagation();
    });

    console.log($('#rightSideNav').length);
    if (!$('#rightSideNav').length){
        $('#contents').css("width","100%");
    }

    var noHeaderHeight = window.innerHeight - $('#header').innerHeight();
    var blueStripsHeight = (noHeaderHeight<500)?500:noHeaderHeight;
    $('#rightSideNav').css("height",blueStripsHeight+'px');
    $('#contents').css("height",blueStripsHeight+'px');
    var topHeightCircleAdd = noHeaderHeight - $('#addtoDos > span').width()-20;
    $('#todosContainer').css("height",blueStripsHeight+'px');
    $('#notifContainer').css("height",blueStripsHeight+'px');
    $('#addtoDos').css("top",10+'px');

    // var addToDoLeft = $("#contents").width()/2 - $('#addtoDos').width()/2;
    // $('#addtoDos').css("left",addToDoLeft);

    // var addToDoLeft = $("#contents").width()/2 - $('#addToDo').width()/2 -10;
    // $('#addToDo').css("left",addToDoLeft);

    $(window).resize(function(){
        noHeaderHeight = window.innerHeight - $('#header').innerHeight();
        blueStripsHeight = (noHeaderHeight<500)?500:noHeaderHeight;
        $('#rightSideNav').css("height",blueStripsHeight+'px');
        $('#contents').css("height",blueStripsHeight+'px');
        topHeightCircleAdd = noHeaderHeight - $('#addtoDos > span').width()-20;
        $('#todosContainer').css("height",blueStripsHeight+'px');
        $('#notifContainer').css("height",blueStripsHeight+'px');

        // addToDoLeft = $("#contents").width()/2 - $('#addtoDos').width()/2;
        // $('#addtoDos').css("left",addToDoLeft);
        
        // addToDoLeft = $("#contents").width()/2 - $('#addToDo').width()/2 -10;
        // $('#addToDo').css("left",addToDoLeft);
    });
    $('.filterOption').click(function(){
        if($(this).hasClass('filterOptionSelected')){
            $(this).removeClass('filterOptionSelected');
        } else {
            $(this).addClass('filterOptionSelected');
        }
        filterToDos();
    });
    $('#addtoDos').click(function(){
        if($('#todosContainer').find('#addToDo').length>0){
            console.log('found');
            $('#todosContainer').find('#addToDo').remove();
        } else{
            console.log('add');
            $('#todosContainer').prepend('<div id="addToDo">'
                +'<ul>'
                +'<li>'
                    +'<div id="addPriority" class="lowPriority">  low</div>'
                    +'<div class="submitToDo button">  add</div>'
                +'</li>'
                +'<li>'
                    +'<input placeholder="Place your todo here" name="todoText" id="addToDoInput" class="ifieldAddToDo">'
                    +'<input placeholder="yyyy-mm-dd" type="date" id="addToDoDueDate" class="ifieldAddToDo">'
                +'</li>'
                +'</ul>'
                +'</div>'
               );        
        }
    });
    
    $("#todosContainer").bind("mousewheel",function(ev, delta) {
        var scrollTop = $(this).scrollTop();
        // console.log(scrollTop);
        $(this).scrollTop(scrollTop-(Math.round(delta)*40));
    });
     $("#notifContainer").bind("mousewheel",function(ev, delta) {
        var scrollTop = $(this).scrollTop();
        // console.log(scrollTop);
        $(this).scrollTop(scrollTop-(Math.round(delta)*40));
    });

    $(".lostPassLink").click(function(){
        $('#recoverPassword').toggle();
    });
    $("#recoverPassword > ul> li > button").click(function(){
        /* password recovery */
        var emailValue = $("#recoverPassword").find("input").val();
        console.log(emailValue);
    });
    $('#userButton').click(function(){
        if (displayingSubmenu){
            $('#userMenu > ul').css("display","none");
            $('#triangle').css("display","none");
            $('#bigTriangle').css("display","none");

            displayingSubmenu = false;
        }
        else{
            $('#userMenu > ul').css("display","block");
            $('#triangle').css("display","block");
            $('#bigTriangle').css("display","block");

            displayingSubmenu = true;
        }
    });




    $('#noToDos > span').click(function(){
        console.log('click');
    });



    $(document).on('click','.todoItemXPand',function(e){
       $(this).parent().next().slideToggle();
    });

    $(document).on('click','.todoDelete',function(e){
        var elem = $(this);
        if(elem.hasClass('todoDeleteUnlocked')){
            var idToDelete = elem.parents('.todoItemWrapper').attr('id');
            
            socket.emit('deleteToDo', {uniqueId: idToDelete});

            elem.parents('.todoItemWrapper').remove();
        } else {
            elem.removeClass('todoDeleteLocked');
            elem.addClass('todoDeleteUnlocked');
            setTimeout(function() {
                elem.removeClass('todoDeleteUnlocked');
                elem.addClass('todoDeleteLocked');
            }, 1000);
        }
    });
    $(document).on('click','.changePriority',function(e){
        var parent = $(this).parents('.todoItemWrapper');
        var id = parent.attr('id');
        var priority;

        if($(this).hasClass("lowPriority")){
            priority="mediumPriority";
        } else {
            if($(this).hasClass("mediumPriority")){
                priority="highPriority";
            } else {
                if($(this).hasClass("highPriority")){
                    priority="lowPriority";
                } else 
                    if ($(this).text() == 'no priority')
                        priority='lowPriority';
            }
        }

        socket.emit('changePriority', {uniqueId: id, value: (priority.split('P')[0])});

        changePriorityToDo(id,priority);
    });
    $(document).on('click','.markDone',function(e){
        var parent = $(this).parents('.todoItemWrapper');
        var id = parent.attr('id');
        markToDoDone(id);

        var priorityElem = parent.find('.changePriority');

        changePriorityToDo(id, 'no priority');


        parent.find('.todoProgress').val(100);
        parent.find('.todoProgress').attr('disabled', 'disabled');

        console.log($('.todoProgress'));
        socket.emit('markDone', {uniqueId: id});
    });
    $(document).on('keypress','.addToDoNoteInput',function(e){
        if(e.which == 13){
            var parent = $(this).parents('.todoItemWrapper');
            var id = parent.attr('id');
            var text = $(this).val();

            if (text.length == 0)
                return;

            $(this).val('');
            parent.find('.todoNotesWrapper ul').prepend(
                '<li class="todoNote"><span class="deleteToDoNote">x</span>' + text + '</li>'
                );

            socket.emit('addToDoNote', {uniqueId: id, value: text});
            console.log(id+' '+text);
        }
    });
    $(document).on('change','.todoProgress',function(e){
        var parent = $(this).parents('.todoItemWrapper');
        var id = parent.attr('id');
        var value = $(this).val();
        parent.find('.progress').text(value);
        // console.log(id+' '+value);
    });
    $(document).on('mouseup','.todoProgress',function(e){
        /*
            websockets aici!
        */
        var parent = $(this).parents('.todoItemWrapper');
        var id = parent.attr('id');
        var val = $(this).val();

        if (val == '100'){
            markToDoDone(id);
            changePriorityToDo(id, 'no priority');
        }

        socket.emit('changeProgress', {uniqueId: id, value: val});
    });
    $('#todosContainer').on('click','.submitToDo',function(){
        addToDoItem();
    });
    $(document).on('keypress','.ifieldAddToDo',function (e){
        if (e.which == 13){
            addToDoItem();
        }
    });
    $(document).on('click','#addPriority',function(){
        if($(this).hasClass("lowPriority")){
            $(this).removeClass();
            $(this).text("medium");
            $(this).addClass("mediumPriority");
        } else {
            if($(this).hasClass("mediumPriority")){
                $(this).removeClass();
                $(this).text("high");
                $(this).addClass("highPriority");
            } else {
                if($(this).hasClass("highPriority")){
                    $(this).removeClass();
                    $(this).text("low");
                    $(this).addClass("lowPriority");
                }
            }
        }
    });
    $(document).on('click','.deleteToDoNote',function(){
        var todoIndex = $(this).parent().index();
        var todoId = $(this).parents('.todoItemWrapper').attr('id');
        
        $(this).parent().remove();
        
        socket.emit('deleteToDoNote', {uniqueId: todoId, index: todoIndex});
    });

    function addToDoItem(){
        var iElem = $('#addToDoInput')
                , dateElem = $('#addToDoDueDate')
                , priorityElem =$('#addPriority')
                , priority
                ;

        $.each(priorityElem.attr('class').split(/\s+/), function (index, item){
            if (item=='highPriority'){
                priority = 'high';
            } else if (item=='mediumPriority'){
                priority = 'medium';
            } else if (item=='lowPriority'){
                priority = 'low';
            }

        });
        var date = dateElem.val();
        var d = new Date();
        if (iElem.val().length < 35 && iElem.val().length > 0){ 
            if(date.length == 0){
                var todoItem = {
                    todo: iElem.val(),
                    dueDate: null,
                    priority: priority,
                    project: selectedProject
                }
                socket.emit('addToDo', { data: todoItem });
                $('#addToDo').remove();
            }  else {
                if(date.split('-')[0]>=d.getYear() && 
                    date.split('-')[1]>d.getMonth() &&
                    date.split('-')[2]>=d.getDate()){

                    var todoItem = {
                        todo: iElem.val(),
                        dueDate: dateElem.val(),
                        priority: priority,
                        project: selectedProject
                    }

                    socket.emit('addToDo', { data: todoItem });
                    $('#addToDo').remove();
                } else {
                    dateElem.css({'border':'1px solid red'});
                }
            }               
        } else {
            iElem.css({'border':'1px solid red'});
        }
    }


    function switchAuthForms(){
        if (loginSection){
            $('#loginMessage').css("display","none");
            $('#loginForm').css("display","none");
            $('#lostPass').css("display","none");
            $('#registerMessage').css("display","block");
            $('#registerForm').css("display","block");
        } else {
            $('#registerMessage').css("display","none");
            $('#registerForm').css("display","none");
            $('#loginMessage').css("display","block");
            $('#loginForm').css("display","block");
            $('#lostPass').css("display","block");
        }

        loginSection = !loginSection;
    }



    $('.authswitch').click(function(){
        switchAuthForms();
    });



    $('#emailReg').blur(function(){
        if ($('#emailReg').val() != "")
            socket.emit('validateEmail', { elementId: '#emailReg', email: $('#emailReg').val()});
    });



    $('#passReg').blur(function(){
        if ($('#passReg').val() != "")
            socket.emit('validatePass', { elementId: '#passReg', password: $('#passReg').val()});
        if ($('#confPassReg').val() != "")
            socket.emit('validateConfPass', { elementId: '#confPassReg', password: $('#passReg').val(), rePassword: $('#confPassReg').val()});
    });



    $('#confPassReg').blur(function(){
        if ($('#confPassReg').val() != "")
            socket.emit('validateConfPass', { elementId: '#confPassReg', password: $('#passReg').val(), rePassword: $('#confPassReg').val()});
    });



    $('#passReg').keyup(function(){
        if ($('#passReg').val() == "")
            $('#passReg').css('background', 'rgba(255, 255, 255, 1)');
    });



    $('#emailReg').keyup(function(){
        if ($('#emailReg').val() == "")
            $('#emailReg').css('background', 'rgba(255, 255, 255, 1)');
    });



    $('#confPassReg').keyup(function(){
        if ($('#confPassReg').val() == "")
            $('#confPassReg').css('background', 'rgba(255, 255, 255, 1)');
    });

    

    $('#registerFormId').submit(function(e){
        if (isValidRegisterData['#emailReg'] == false)
            e.preventDefault(); 
        if (isValidRegisterData['#passReg'] == false)
            e.preventDefault(); 
        if (isValidRegisterData['#confPassReg'] == false)
            e.preventDefault(); 
    });

    
    var submited = true;
    $('#loginFormId').submit(function (e) {
        console.log(submited);
        if (submited === true) {
            socket.emit('validateLoginData', { email: $('#emailLog').val(), password: $('#passLog').val() });            

            return false;
        }
    });


    socket.on('loginValidationResult', function (data){
        console.log(data);
        if (data.result === 'ok') {
            submited = false;

            $('#emailLog').css('background', 'rgba(255, 255, 255, 1)');
            $('#passLog').css('background', 'rgba(255, 255, 255, 1)'); 
            
            $('#loginFormId').submit();
        } else if (data.result === 'invalid_email') {
            $('#emailLog').css('background', 'rgba(249, 218, 226, 1)');
            $('#passLog').css('background', 'rgba(255, 255, 255, 1)');    
        } else if (data.result === 'invalid_password') {
            $('#emailLog').css('background', 'rgba(255, 255, 255, 1)');
            $('#passLog').css('background', 'rgba(249, 218, 226, 1)');    
        }
    });



    socket.on('validationResult', function(data){
        console.log(data);
        if (!data.isValid) {
            $(data.elementId).css('background', 'rgba(249, 218, 226, 1)');
            isValidRegisterData[data.elementId] = false;
        } else {
            $(data.elementId).css('background', 'rgba(167, 251, 204, 1)');
            isValidRegisterData[data.elementId] = true;
        }
    });
    socket.on('addToDoError', function(data){
        console.log(data);
    });



    socket.on('validToDo', function(data){
        var todoItemWrapper = $('<div>', {class: 'todoItemWrapper', id: data.uniqueId});
        var todoitemDiv = $('<div>', {class: 'todoItem'});
        var todoItemXPandDiv;
        var todoContentDiv = $('<div>', {class: 'toDoContent'});
        var todoDateTimeDiv = $('<div>', {class: 'toDoDateTime'});
        var progressDiv = $('<div>', {class: 'progress highPriority'});
        var contentPar = $('<p>');
        var dueDatePar = $('<p>');
        var advancedOpt = $('<div>', {class: 'toDoAdvancedOpt'});
        var span = $('<span>');
        todoItemXPandDiv = $('<div>', {class: 'todoItemXPand'});
        progressDiv = $('<div>', {class: 'progress'});

        contentPar.text(data.todo);

        if (data.duedate != null)
            dueDatePar.text(data.duedate);
        else
            dueDatePar.text('nu due date');
        
        switch (data.priority) {
                case 'low':
                    priority = 'lowPriority';
                    break;
                case 'medium':
                    priority = 'mediumPriority';
                    break;
                case 'high':
                    priority = 'highPriority';
            }

        span.html('&rang;');

        todoItemXPandDiv.append(span);

        todoContentDiv.append(contentPar);

        todoDateTimeDiv.append(dueDatePar);

        progressDiv.text(data.percentage);

        todoitemDiv.append(todoItemXPandDiv);
        todoitemDiv.append(todoContentDiv);
        todoitemDiv.append(todoDateTimeDiv);
        todoitemDiv.append(progressDiv);
        todoItemWrapper.append(todoitemDiv);
        todoItemWrapper.append(advancedOpt);
        advancedOpt.append('<span class="todoDelete todoDeleteLocked"></span>'
                +'<div class="todoOptions">'
                    +'<span class="changePriority"></span>'
                    +'<span class="markDone todoDone">done</span>'
                    +'<input class="todoProgress" type="range" min="0" max="100" step="25" value="0"/>'
                +'</div>'
                +'<div class="todoNotesWrapper">'
                    +'<input type="text" class="addToDoNoteInput"/>'
                    +'<ul>'
                    +'</ul>'
                +'</div>'
                );
        todoItemWrapper.append(todoitemDiv);
        todoItemWrapper.append(advancedOpt);

        $('#todosContainer').prepend(todoItemWrapper); 
        changePriorityToDo(data.uniqueId,priority);
    });


    $('#searchUser').keyup(function (){
        socket.emit('findUsers', {email: $('#searchUser').val()});
    });



    socket.on('takeUsers', function (data){
        console.log(data);
    });

    socket.on('takeNotifications', function (data){
        console.log(data);
    });

});
function filterToDos(){
    var filters = [];
    $('.filterOption').each(function (index,value){
        if($(value).attr('class').split(/\s+/)[2]){
            filters.push($(value).attr('class').split(/\s+/)[1])
        }
    });
    if(filters.length == 0){
        $('.todoItemWrapper').each(function (index,value){
            $(value).css({"display":"block"});
        });
    } else {
        $('.todoItemWrapper').each(function (index,value){
            if(filters.indexOf($(value).find('.todoItemXPand').attr('class').split(/\s+/)[2])!=-1 
                || filters.indexOf($(value).find('.todoItemXPand').attr('class').split(/\s+/)[1])!=-1){
                $(value).css({"display":"block"});
            } else {
                $(value).css({"display":"none"});
            }
        });
    }
}
function markToDoDone(elemId,from){
    var elem = $('#'+elemId);
    elem.find('.todoItemXPand').addClass('todoDone');
    elem.find('.progress').addClass('todoDone');
    elem.find('.progress').text('100');
    elem.find('.todoProgress').attr('disabled', 'disabled');
}

function changePriorityToDo (elemId, priority){
    var elem = $('#'+elemId);
    var remClass = "";
    var text;
    if(priority == "lowPriority"){
        text = "low";
        remClass = "highPriority";
    } else {
        if(priority == "mediumPriority"){
            text = "medium";
            remClass = "lowPriority";
        } else {
            if(priority == "highPriority"){
                text = "high";
                remClass = "mediumPriority";
            } 
        }
    }
    
    if (priority == 'no priority'){
        var priorityElem = elem.find('.changePriority');
        
        priorityElem.text('no priority');

        if (priorityElem.hasClass('lowPriority'))
                priorityElem.removeClass('lowPriority');
            else if (priorityElem.hasClass('mediumPriority'))
                    priorityElem.removeClass('mediumPriority');
                else if (priorityElem.hasClass('highPriority'))
                       priorityElem.removeClass('highPriority');
        
    } else {
        elem.find('.todoItemXPand').removeClass('todoDone');
        elem.find('.todoItemXPand').removeClass(remClass);
        elem.find('.todoItemXPand').addClass(priority);
        elem.find('.progress').removeClass(remClass);
        elem.find('.progress').removeClass('todoDone');
        elem.find('.progress').addClass(priority);
        elem.find('.changePriority').removeClass(remClass);
        elem.find('.changePriority').addClass(priority);
        elem.find('.changePriority').text(text);
        if (elem.find('.todoProgress').attr('disabled') == 'disabled'){
            elem.find('.todoProgress').val('0');
            elem.find('.progress').text('0');
            elem.find('.todoProgress').removeAttr('disabled');
        }
    }
}
