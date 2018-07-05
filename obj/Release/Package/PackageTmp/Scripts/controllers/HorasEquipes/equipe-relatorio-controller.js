angular.module('checkin').controller('EquipeRelatorio', function($scope, $http) {

    $scope.searchSpinner = true;
    $scope.show = true;
    $scope.procurar = "";

    $scope.uri = window.localStorage.getItem('rangeDePesquisa');
    $scope.id = window.localStorage.getItem('idSearch');
    let service = `/horasequipe/ReportHorasCompleto${$scope.uri}`;
    $http.get(service)
    .then(function (response) {
        $scope.result = [];
        if(response.data.Result.length > 0) {
            $scope.result = response.data.Result;
        } else {
            $scope.result = [];
            $scope.searchSpinner = false;
            $scope.show = false;
            $scope.message = "Nenhum registro encontrado para o período pesquisado.";
        }
        $scope.ExcelLink = "/HorasProjeto/ReportExcel"+$scope.uri;
        $scope.searchSpinner = false;
    }, function (response) {
        console.log(response);
    });

    //This area need to be refactored
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

    console.log($scope.titulo);

    $scope.ordenar = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };
});
