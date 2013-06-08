$(document).ready(function(){
    socket.emit('giveMeProjects', {});

    $("#rightSideNav").bind("mousewheel",function(ev, delta) {
        var scrollTop = $(this).scrollTop();
        // console.log(scrollTop);
        $(this).scrollTop(scrollTop-(Math.round(delta)*40));
    });

    $(document).on('click',".deleteProjectItem",function(){
        var id = $(this).parent().attr('id');
        
        socket.emit('removeProject', {uniqueId: id});

        socketToDos.emit('giveMeToDosByProjectID', {uniqueId: '#untitled'});

        //$('.listItemsNavGroup').find('.listProjectItem').first().addClass('listProjectItemSelected');

        $(this).parent().remove();
    });

    $(document).on('click','.addProject',function(){
        addProject($(this).next());
    });
    $(document).on('click','.listProjectItem',function(){
        $('.filterOption').each(function (index,value){
            $(this).removeClass('filterOptionSelected');
        });
        selectedProject = $(this).attr('id');
        $('.listItemsNavGroup').find('.listProjectItem').each(function(index,value){
            $(value).removeClass('listProjectItemSelected');
        })
        $(this).addClass('listProjectItemSelected');

        socketToDos.emit('giveMeToDosByProjectID', {uniqueId: selectedProject});
    });
    $(document).on('keypress','.newProject > input',function(e){
        if(e.which == 13){
            addProject($(this));
        }
    });
    socket.on('validProject', function (data){
         var elem = '<li class="listProjectItem" id="' + data.uniqueId + '">' + data.name + '<span class="deleteProjectItem">x</span></li>';
         $('.listItemsNavGroup > ul > li').first().after(elem);
    });

    socket.on('takeProjects', function (data){
        var length = data.projects.length;


        for (var counter = 0; counter < length; counter++){
            var elem = '<li class="listProjectItem" id="' + data.projects[counter].value.uniqueId + '">' + data.projects[counter].value.name + '<span class="deleteProjectItem">x</span></li>';
            $('.listItemsNavGroup > ul > li').first().after(elem);    
        }
    });

});

function addProject(elem){
    console.log(elem.val());
    
    var matches = elem.val().match('^[ a-zA-Z0-9]+$');

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