$(".wait").slideDown(500);
$("#divCampos").hide();
var pdata = {};
pdata["idUsuario"] = localStorage.getItem('idSearch');
$(".user-data").empty();
function StringGenerator(name) {
  $.getJSON('/Dados/ListaUsuarios', pdata, function (data){
    if (data.Result.length > 0) {
      let user = data.Result[0];
      console.log(user);
      let container = document.querySelector('.user-data');
      container.innerHTML = `
        <div class="tool clearfix">
          <h2>${name}</h2>
          <div class="btn-container">
            <button type="button" onclick="hideContainer()" class="btn btn-danger btn-cancel">Cancelar</button>
            <button type="button" class="btn btn-warning btn-edit" onclick="EditarUsuario('${user.usr_Id}', '${user.usr_Login}', '${user.usr_Nome}', '${user.usr_Email}', '${(user.usr_Tel === "")? "Não informado" : user.usr_Tel }', '${user.fnc_Nome}', '${user.estr_Nome}', '${user.estr_apr}', '${user.estr_apr}', '${user.usr_imagePerfil}');">Editar</button>
          </div>
        </div>
        <div class="user-infos d-flex flex-column">
          <div class="p-2">
            <p class="title">Login</p>
            <p class="userInfo">${user.usr_Login}</p>
          </div>
          <div class="p-2">
            <p class="title">Função</p>
            <p class="userInfo">${user.fnc_Nome}</p>
          </div>
          <div class="p-2">
            <p class="title">Estrutura</p>
            <p class="userInfo">${user.estr_Nome}</p>
          </div>
          <div class="p-2">
            <p class="title">Email</p>
            <p class="userInfo">${user.usr_Email}</p>
          </div>
          <div class="p-2">
            <p class="title">Telefone</p>
            <p class="userInfo">${user.usr_Tel}</p>
          </div>
        </div>
      `;
      hideBtnCancel()
    } else {
      console.log("Uncaught error");
    }
  });
}
$(".wait").slideUp(500);
