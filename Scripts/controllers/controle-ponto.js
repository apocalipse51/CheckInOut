angular.module('checkin').controller('ControlePonto', function($scope, $window, $http) {
    $scope.title = "Controle de ponto";       
    let data = GetDate();
    let { Inicial, Final } = data;   
    $scope.relatorio = [];
    $http.get(`/ControlePonto/GetReport?DtInicial=${Inicial}&DtFinal=${Final}`).then(function(res) {
        $scope.relatorio = res.data.Result;
        console.log($scope.relatorio);
    }, function(err) {
        console.log(err);
    });
    function GetDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let inicial = `${year}-${month}-${day}`;
        let final = `${year}-${month+1}-${day}`;
        return {
            Inicial: inicial,
            Final: final
        }
    }
});