$(document).ready(function() {
    var loginSection = true
        , displayingSubmenu = false
        , socket = io.connect('http://localhost:3000/shared')
        , isValidRegisterData = { '#passReg': false, '#confPassReg': false, '#emailReg': false};
    // $('#todosContainer').sortable();
    // $('#todosContainer').disableSelection();
    // fade in!
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

    if (!$('#rightSideNav').length){
        $('#contents').css("width","100%");
    }

    var noHeaderHeight = window.innerHeight - $('#header').innerHeight();
    $('#rightSideNav').css("height",((noHeaderHeight<500)?500:noHeaderHeight)+'px');
    $('#contents').css("height",((noHeaderHeight<500)?500:noHeaderHeight)-65+'px');
    var topHeightCircleAdd = noHeaderHeight - $('#addtoDos > span').width()-20;
    $('#todosContainer').css("height",topHeightCircleAdd-30+'px');
    $('#addtoDos').css("top",topHeightCircleAdd+'px');

    var addToDoLeft = $("#contents").width()/2 - $('#addtoDos').width()/2;
    $('#addtoDos').css("left",addToDoLeft);

    var addToDoLeft = $("#contents").width()/2 - $('#addToDo').width()/2 -10;
    $('#addToDo').css("left",addToDoLeft);

    $(window).resize(function(){
        noHeaderHeight = window.innerHeight - $('#header').innerHeight();
        $('#rightSideNav').css("height",((noHeaderHeight<500)?500:noHeaderHeight)+'px');
        $('#contents').css("height",((noHeaderHeight<500)?500:noHeaderHeight)-65+'px');
        topHeightCircleAdd = noHeaderHeight - $('#addtoDos > span').width()-20;
        $('#todosContainer').css("height",topHeightCircleAdd-30+'px');
        $('#addtoDos').css("top",topHeightCircleAdd+'px');

        addToDoLeft = $("#contents").width()/2 - $('#addtoDos').width()/2;
        $('#addtoDos').css("left",addToDoLeft);
        
        addToDoLeft = $("#contents").width()/2 - $('#addToDo').width()/2 -10;
        $('#addToDo').css("left",addToDoLeft);
    });

    $('#addtoDos').click(function(){
        $('#addToDo').toggle();
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


    $('#addPriority').click(function(){
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

    $('#addToDo').keypress(function (e){
        if (e.which == 13){

            var iElem = $('#addToDoInput')
                , dateElem = $('#addToDoDueDate')
                , timeElem = $('#addToDoHour')
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

            if (iElem.val().length != 0){
                var cookJson = getCookie('todo_logged_in');
                var logged;

                if (!cookJson) {
                    cookJson = getCookie('todo_memory');

                    logged = 'notLogged';

                    if (!cookJson)
                        return;
                } else {
                    logged = cookJson?cookJson.user:null;
                }
                    

                var todoItem = {
                    _id: cookJson?cookJson._id:null,
                    todo: iElem.val(),
                    dueDate: dateElem.val()?dateElem.val():null,
                    dueTime: timeElem.val()?timeElem.val():null,
                    priority: priority,
                    loggedIn: logged
                }

                socket.emit('addToDo', { data: todoItem });
                $('#addToDo').toggle();
                iElem.val('');
                dateElem.val('');
                timeElem.val('');
                priorityElem.removeClass();
                priorityElem.addClass('lowPriority');
                priorityElem.val('low');
            }
        }
    });



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

    $('#datepicker').datepicker({
        inline: true,
        nextText: '&rarr;',
        prevText: '&larr;',
        showOtherMonths: true,
        dateFormat: 'dd MM yy',
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        showOn: "button",
        buttonImage: "img/calendar-blue.png",
        buttonImageOnly: true,
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
});

function getCookie(cookieName) {
    var cook = null;
    var cookJson = null;
    cook = $.cookie(cookieName);

    if (cook){
        var startPos = cook.indexOf('{');
        var stopPos = 0;

        for (var i = cook.length - 1; i >= 0; i--) {
            if (cook[i] == '}'){
                stopPos = i+1;
                break;
            }
        }

        cookJson = $.parseJSON(cook.substring(startPos,stopPos));
    }

    return cookJson;
}