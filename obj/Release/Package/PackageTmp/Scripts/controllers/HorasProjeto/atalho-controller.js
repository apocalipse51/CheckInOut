angular.module('checkin').controller('AtalhoController', function($scope, $http, $window) {

    window.onload = () => {
      $scope.IniciarAlmoco('lista');
      $scope.CarregaHorasProjetoAtalho();
      $scope.VerificaNumeroJust();
      $scope.CarregaComboClienteFinal();
      window.location = "#cbxJustificativa";
    };

    $http.get(`/horasprojeto/ListaHorasProjetosUsuarioAtalho`).then(function (res) {
        //$scope.options = $scope.Unique(res.data.Result);
        //createOptions($scope.options, 'clientes');
        //$scope.makeSearch('Cliente', $scope.options[0]);
        let lista = res.data;
        let arr = lista.Result.map((x, index) => {
          return `<option value="Atalho${index+1}">${x.prj_Descricao} > ${x.sfp_Descricao}</option>`;
        });
        //{prj_Descricao: "Front - Retenção", sfp_Descricao: "Cronograma", hpoa_Atalho: "Atalho1   "}
        document.querySelector('.shortcut-group').innerHTML = `
            <select class="shortcuts">
              ${arr}
            </select>
        `;
    });

    $scope.startTask = () => {
      let value = document.querySelector('.shortcuts').value;
      $http.get(`/horasprojeto/IniciaHorasProjetosUsuarioAtalho?atalho=${value}`).then(res => console.log(res), err => console.log(err));
      $scope.CarregaHorasProjeto();
    };

    $scope.finalizarTarefa = () => {
      $http.get(`/horasprojeto/fechahorario?id=118`).then(res => console.log(res), err => console.log(err));
    };

    $scope.Justify = () => {
      $scope.MostrarJustificarHora();
    };

});
