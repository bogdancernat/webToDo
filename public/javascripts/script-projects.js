$(document).ready(function(){
    $("#rightSideNav").bind("mousewheel",function(ev, delta) {
        var scrollTop = $(this).scrollTop();
        // console.log(scrollTop);
        $(this).scrollTop(scrollTop-(Math.round(delta)*40));
    });
    $(document).on('click',".deleteProjectItem",function(){
        var id = $(this).parent().attr('id');
        /* 


        websockets here



        */
        $(this).parent().remove();
    });
    $(document).on('click','.addProject',function(){
        addProject($(this).next());
    });
    $(document).on('keypress','.newProject > input',function(e){
        if(e.which == 13){
            addProject($(this));
        }
    });

    socket.on('validProject', function (data){
         var elem = '<li class="listProjectItem" id="' + data.uniqueId + '">' + data.name + '<span class="deleteProjectItem">x</span></li>';
         $('.listItemsNavGroup > ul').prepend(elem);
    });
});

function addProject(elem){
    console.log(elem.val());
    
    var matches = elem.val().match('^[a-z0-9]+$');

    if (matches == null || matches.length != 1) {
        elem.css({'background': '#fbb1b1'});
        return;
    }


    if (elem.val().length > 20){
        elem.css({'background': '#fbb1b1'});
        return;
    }

    var project = {
        name: elem.val()
    };

    elem.css({'background': '#accded'});

    socket.emit('addProject', project);

    elem.val("");
}