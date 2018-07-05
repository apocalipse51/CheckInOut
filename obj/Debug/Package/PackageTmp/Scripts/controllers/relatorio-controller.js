angular.module('checkin').controller('RelatorioController', function($scope, $http) {
    $scope.searchSpinner = true;
    $scope.show = true;
    $scope.procurar = "";
    $scope.uri = window.localStorage.getItem('rangeDePesquisa');
    $scope.id = window.localStorage.getItem('idSearch');
    let service = `/horas/ReportCompleto${$scope.uri}&id=${$scope.id}`;
    $http.get(service).then(function (response) {
        $scope.result = [];
        if(response.data.UsuarioHoras.length > 0) {
            if(response.data.Recursos.length > 0) {
                $scope.result = response.data.UsuarioHoras.concat(response.data.Recursos);
            } else {
                $scope.result = response.data.UsuarioHoras;
            }
        }
        else
        {
            $scope.searchSpinner = false;
            $scope.show = false;
            $scope.message = "Nenhum registro encontrado para o período pesquisado.";
        }
        $scope.ExcelLink = "/HorasProjeto/ReportExcel"+$scope.uri;
        console.log($scope.ExcelLink);
        $scope.searchSpinner = false;
    }, function (response) {
        console.log(response);
    });

    let data = window.localStorage.getItem('datas');
    data = JSON.parse(data);
    let inicial = new Date(data.inicial);
    let final = new Date(data.final);
    let iDay = inicial.getDate();
    let iMonth = inicial.getMonth();
    let iYear = inicial.getFullYear();
    let fDay = final.getDate();
    let fMonth = final.getMonth();
    let fYear = final.getFullYear();
    $scope.titulo = `Relatório de Horas (${iDay}/${iMonth+1}/${iYear} - ${fDay}/${fMonth+1}/${fYear})`;

    $scope.ordenar = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };

    function defineTime(x) {
      let inicial = x.Data_Inicio;
      inicial = inicial.split("/");
      inicial = `${inicial[2]}-${inicial[1]}-${inicial[0]}`;
      let fim = x.Data_Fim;
      fim = fim.split("/");
      fim = `${fim[2]}-${fim[1]}-${fim[0]}`;
      return {inicial, fim};
    }

});
