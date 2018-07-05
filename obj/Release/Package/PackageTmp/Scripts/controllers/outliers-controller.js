angular.module('checkin').controller('OutliersController', function($scope, $http) {
    $scope.searchSpinner = true;
    $scope.show = true;
    (function() {
        const uri = window.localStorage.getItem('rangeDePesquisa');
        const id = window.localStorage.getItem('idSearch');
        let service = `/horas/ReportCompleto${uri}&id=${id}`;
        $http.get(service).then(function(res) {
          if(res.data.UsuarioHoras.length > 0){
            if(res.data.Recursos.length > 0) {
              document.querySelector('#graphic-outliers-major').innerHTML = "";
              document.querySelector('#graphic-outliers-minor').innerHTML = "";
              let list = $scope.FilterOutliers(res.data.Estrutura, res.data.UsuarioHoras, $scope.Unique(res.data.Nomes), res.data.Recursos, res.data.UsuarioNome);
              console.log(list);
              if((list.Acima.length > 0) || (list.Abaixo.length > 0)) {
                $scope.GraphOutlier(list, "Outliers");
                $scope.searchSpinner = false;
              } else {
                $scope.searchSpinner = false;
                $scope.message = "Nenhum registro encontrado pela pesquisa!";
              }
            } else {
              document.querySelector('#graphic-outliers-major').innerHTML = "";
              document.querySelector('#graphic-outliers-minor').innerHTML = "";
              let list = $scope.FilterOutliers(res.data.Estrutura, res.data.UsuarioHoras, $scope.Unique(res.data.Nomes), res.data.Recursos, res.data.UsuarioNome);
              if((list.Acima.length > 0) || (list.Abaixo.length > 0)) {
                $scope.GraphOutlier(list, "Outliers");
                $scope.searchSpinner = false;
              } else {
                $scope.searchSpinner = false;
                $scope.message = "Nenhum registro encontrado pela pesquisa!";
              }
            }
          } else {
            document.querySelector('#graphic-outliers-major').innerHTML = "";
            document.querySelector('#graphic-outliers-minor').innerHTML = "";
            $scope.searchSpinner = false;
            $scope.message = "Nenhum registro encontrado para o período pesquisado!";
          }
        }, function(err) {
          document.querySelector('#graphic-outliers-major').innerHTML = "";
          document.querySelector('#graphic-outliers-minor').innerHTML = "";
          $scope.message = "Um erro inesperado ocorreu!";
          $scope.searchSpinner = false;
          console.log(err);
        });
    }());
});
