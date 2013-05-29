$(document).ready(function() {
  var loginSection = true;
  var displayingSubmenu = false;

  // fade in!
  $('#loginButton').click(function(){
    $('#grayarea').css("display","block");
    $('#grayarea').fadeTo(200,1);
    $('#authWrapper').css("display","block");
    $('#authWrapper').animate({
      marginTop:'220px'
    },400);
    if(!loginSection){
      switchAuthForms();
  }});
  // fade out!
  $('#grayarea').click(function(){
    $('#authWrapper').animate({
      marginTop:'-320px'
    },400, function(){
      $('#authWrapper').css("display","none");
    });
    $('#grayarea').fadeTo(200,0, function(){
      $('#grayarea').css("display","none");
    });
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
});