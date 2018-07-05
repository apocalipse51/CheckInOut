angular.module('checkin').controller('HorasController', function($scope, $http) {

    $scope.searchSpinner = true;
    $scope.show = true;
    $scope.linkHoras = "/HorasProjeto/ReportHorasCompleto#!/horas";
    $scope.linkOutliers = "/HorasProjeto/ReportHorasCompleto#!/outliers";
    $scope.linkRelatorio = "/HorasProjeto/ReportHorasCompleto#!/relatorio";
    const datas = JSON.parse(window.localStorage.getItem('datas'));
    const uri = $scope.GenerateUri(datas);
    const id = window.localStorage.getItem('idSearch');

    (function() {
        let service = `/horas/ReportCompleto${uri}&id=${id}`;
        $http.get(service).then(function(res) {
          if(res.data.UsuarioHoras.length > 0) {
            if(res.data.Recursos.length > 0) {
              document.querySelector("#graphic-horas").innerHTML = "";
              let list = $scope.Filtrar(res.data.Estrutura, res.data.UsuarioHoras, $scope.Unique(res.data.Nomes), res.data.Recursos, res.data.UsuarioNome);              
              $scope.GraphLine(list, "Horas");
              $scope.searchSpinner = false;
            } else {
              document.querySelector("#graphic-horas").innerHTML = "";
              let list = $scope.Filtrar(res.data.Estrutura, res.data.UsuarioHoras, $scope.Unique(res.data.Nomes), res.data.Recursos, res.data.UsuarioNome);
              $scope.GraphLine(list, "Horas");
              $scope.searchSpinner = false;
            }
          } else {
            $scope.show = false;
            $scope.searchSpinner = false;
            document.querySelector("#graphic-horas").innerHTML = "";
            $scope.message = "Nenhum registro encontrado pela pesquisa!";
          }
        }, function(err) {
          document.querySelector("#graphic-horas").innerHTML = "";
          $scope.message = "Um erro inesperado ocorreu!";
          console.log(err);
        });
    }());

});
