angular.module('checkin').controller('MainController', function($scope, $http, $window) {

    $scope.error = false;
    //faz a pesquisa dos últimos 30 dias
    let data = GetDate();
    let { Inicial, Final } = data;
    $scope.dtInicial = Inicial;
    $scope.dtFinal = Final;
    //faz a primeira chamada a função para já apresentar os dados dos últimos 30 dias    
    pesquisar(Inicial, Final);

    $scope.remover = function() {
        $scope.error = false;
    }

    $scope.searchSpinner = true;

    $scope.validaPesquisa = function() {
        $scope.dtInicial = new Date($scope.dtInicial);
        $scope.dtFinal = new Date($scope.dtFinal);
        if ($scope.dtFinal.getMonth() != $scope.dtInicial.getMonth()) {
            //Meses de pesquisa diferentes 
            //30 - dias = período de pesquisa
            let month = ($scope.dtFinal.getMonth() + 1) - ($scope.dtInicial.getMonth() + 1);
            if (month <= 1) {
                let res = 30 - $scope.dtInicial.getDate();
                res += ($scope.dtFinal.getDate() + 1);
                if (res > 41) {
                    $scope.error = true;
                } else {
                    $scope.error = false;
                    pesquisar($scope.dtInicial, $scope.dtFinal);
                }
            } else {
                $scope.error = true;
            }
        } else {
            $scope.error = false;
            pesquisar($scope.dtInicial, $scope.dtFinal);
        }
    }

    function pesquisar(dtInicial, dtFinal) {
        $scope.inicial = `${dtInicial.getFullYear()}-${dtInicial.getMonth() + 1}-${dtInicial.getDate()}`;
        $scope.final = `${dtFinal.getFullYear()}-${dtFinal.getMonth() + 1}-${dtFinal.getDate()}`;
        $scope.range = `?DtInicio=${$scope.inicial}&DtFim=${$scope.final}&Tipo=0`;
        let pesquisa = `?DtInicio=${$scope.inicial}&DtFim=${$scope.final}`;
        window.localStorage.removeItem('datas');
        window.localStorage.setItem('datas', JSON.stringify({
            inicial: $scope.dtInicial,
            final: $scope.dtFinal
        }));
        window.localStorage.removeItem('rangeDePesquisa');
        window.localStorage.setItem('rangeDePesquisa', $scope.range);
        window.localStorage.removeItem('pesquisa');
        window.localStorage.setItem('pesquisa', pesquisa);
        //let external = `/horas/CalculaDiasUteis?inicial=${$scope.inicial}&final=${$scope.final}`;        
        let external = `https://elekto.com.br/api/Calendars/br-BC/Delta?initialDate=${$scope.inicial}&finalDate=${$scope.final}&type=whole`;
        $http.get(external).then(function(response) {
            window.localStorage.removeItem('diasUteis');
            window.localStorage.setItem('diasUteis', JSON.stringify({ dias: response.data.WorkDays, horas: response.data.WorkDays * 8 }));
            $window.location.href = '/HorasProjeto/ReportHorasCompleto#!/';
            $window.location.href = '/HorasProjeto/ReportHorasCompleto#!/relatorio';
        }, function(response) {
            console.log(response);
        });
    }

    function GetDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let inicial = new Date(year, (month - 1), day);
        //let inicial = `${year}-${month}-${day}`;
        let final = new Date(year, month, day);
        //let final = `${year}-${month+1}-${day}`;
        return {
            Inicial: inicial,
            Final: final
        }
    }

});