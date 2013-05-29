$(document).ready(function() {
  var loginSection = true;
  var displayingSubmenu = false;
  var socket = io.connect('http://localhost:3000');
  var isValidRegisterData = { '#passReg': false, '#confPassReg': false, '#emailReg': false};

  $('#loginButton').click(function(){
    $('#grayarea').css("display","block");
    if(!loginSection){
      switchAuthForms();
  }});
  $('#grayarea').click(function(){
    $('#grayarea').css("display","none");
  });
  $('#authWrapper').click(function(e){
    e.stopPropagation();
  });
  $('#userButton').click(function(){
    if(displayingSubmenu){
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
  function switchAuthForms(){
    if(loginSection){
      $('#loginMessage').css("display","none");
      $('#loginForm').css("display","none");
      $('#lostPass').css("display","none");
      $('#registerMessage').css("display","block");
      $('#registerForm').css("display","block");
    }
    else{
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
  $('#addButton').click(function(){
    socket.emit('addToDo', { toDo: $('#toDoTextArea').val()});    
    return false;
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

  socket.on('updateToDoList', function (data){
    $('#toDos').append('<li>' + data.toDo + '</li>');
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
});

