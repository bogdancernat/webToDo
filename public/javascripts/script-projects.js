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
});

function addProject(elem){
    console.log(elem.val());


    elem.val("");
}