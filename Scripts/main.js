$(document).ready(function () {
    $(".menu").click(function () {
        if ($(".menu-bg").is(":visible")) {
            $(".menu-bg").fadeOut(300);
            $(".painel").removeClass("blur");
        }
        else{
            $(".menu-bg").fadeIn(300);
            $(".painel").addClass("blur");
        }        
    });

    $(".menu-bg").click(function () {
        $(".painel").removeClass("blur");
        $(".menu-bg").fadeOut(300);
    });
});

