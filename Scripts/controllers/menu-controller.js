angular.module('checkin').controller("MenuController", function ($scope, $http) {
    $scope.itens = [];
    $scope.navigateTo = function (controller, action) {
        let con = `/${controller}`;
        let ac = `/${action}`;
        let uri = `${con}${ac}`;
        window.location.replace(uri);
        console.log(uri);
    }
    $http.get('/Usuario/BuscaTelas?usuarioId=107').then(function (res) {
        let result = res.data.Result;
        console.log(result);
        $scope.itens = result;
    }, function (err) {
        console.log(err);
    });
});