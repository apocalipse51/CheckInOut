angular.module('checkin').controller('EquipeHoras', function($scope, $http, $window) {

    $scope.searchSpinner = true;
    $scope.show = true;

    const uri = window.localStorage.getItem('rangeDePesquisa');
    $scope.title = "";
    $scope.message = "";
    $scope.t = true;

    (function() {
        $http.get('/HorasEquipe/heads').then(function(res) {
            $http.get(`/HorasEquipe/ReportHorasCompleto${uri}`).then(function(r) {
                if(r.data.Result.length > 0){
                    document.querySelector('#graphic-horas').innerHTML = "";
                    $scope.title = `Relatório de Horas - Geral`;
                    let heads = $scope.Unique(res.data.Result);
                    let lista = r.data.Result;
                    let preFilter = $scope.GetHoursAltered(lista);
                    let list = $scope.GetStructuredList(heads, preFilter);
                    if(lista.length > 0) {
                        $scope.t = false;
                        list.forEach(x => {
                            $scope.GraphLine(x);
                        });
                        $scope.searchSpinner = false;
                    } else {
                        $scope.t = true;
                        $scope.searchSpinner = false;
                        $scope.ScrollToDown();
                        $scope.message = "Nenhum registro encontrado pela pesquisa!";
                    }
                } else {
                    $scope.show = true;
                    $scope.searchSpinner = false;
                    $scope.ScrollToDown();
                    $scope.message = "Nenhum registro encontrado para o período pesquisado.";
                }
            }, function(err) {
                $scope.searchSpinner = false;
                $scope.show = false;
                $scope.message = "Nenhum registro encontrado para o período pesquisado.";
                $scope.ErrorInfo();
                console.log(err);
            })
        }, function(err) {
            $scope.searchSpinner = false;
            $scope.show = false;
            $scope.message = "Nenhum registro encontrado para o período pesquisado.";
            $scope.ErrorInfo();
            console.log(err);
        })
    }());

    $scope.ScrollToDown = () => {
        let headerHeight = document.querySelector('.header-container').offsetHeight;
        let menu = document.querySelector('.menu-equipe').offsetHeight;
        let nav = document.querySelector('.nav-options').offsetHeight;
        let cont = document.querySelector('.cont').offsetHeight;
        let heightFull = (parseFloat(headerHeight) + parseFloat(menu) + parseFloat(nav) + parseFloat(cont)) + 400;
        $window.scrollTo(0, heightFull);
    };

});
