function Sessao() {
    var tempo;

    window.onmousemove = reiniciaTempo;
    window.onmousedown = reiniciaTempo;
    window.onclick = reiniciaTempo;
    window.onscroll = reiniciaTempo;
    window.onkeypress = reiniciaTempo;

    function logout() {

        document.location.assign($("#LogoutUsuarioURL").val());
    }


    function reiniciaTempo() {
        clearTimeout(tempo);
        tempo = setTimeout(logout, ((5 * 60) * 10000));
    }
}