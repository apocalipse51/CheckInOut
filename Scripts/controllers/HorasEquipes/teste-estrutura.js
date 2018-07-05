angular.module('checkin').controller('EstruturaController', function($http, $scope, $window) {

    $scope.where = "Estruturas";

    $scope.searchSpinner = true;
    $scope.show = true;
    $scope.drop = false;
    
    const data = JSON.parse(window.localStorage.getItem('datas'));
    $scope.title = "";
    $scope.field = 'Estrutura';
    $scope.t = true;

    $http.get('/horasequipe/heads').then(res => {        
        $scope.options = $scope.Unique(res.data.Result);
        createOptions($scope.options, 'estruturas');
        $scope.makeSearch('Estrutura', $scope.options[0]);
    });

    $scope.makeSearch = (field, value) => {
        $scope.searchSpinner = true;
        let inicial = new Date(data.inicial);
        let final = new Date(data.final);
        inicial = `${inicial.getFullYear()}-${inicial.getMonth()+1}-${inicial.getDate()}`;
        final = `${final.getFullYear()}-${final.getMonth()+1}-${final.getDate()}`;
        let service = `/HorasEquipe/headsfind?DtInicio=${inicial}&DtFim=${final}&head=${value}`;                        
        $http.get('/HorasEquipe/heads').then(function(res) {
            $http.get(service).then(function(r) {
                if (r.data.Result.length > 0) {
                    document.querySelector('#graphic-horas').innerHTML = "";
                    $scope.message = "";
                    $scope.title = `Relatório de Horas - ${value}`;
                    let heads = $scope.Unique(res.data.Result);
                    let lista = r.data.Result;
                    let preFilter = $scope.GetHoursAltered(lista);
                    let list = $scope.GetStructuredList(heads, preFilter);

                    if (lista.length > 0) {
                        $scope.t = false;
                        let error = true;
                        list.forEach(x => {
                            if ((x.Estrutura == value) && (x.Recursos.length > 0)) {
                                error = false;
                                $scope.GraphLine(x, 'Horas');
                            }
                        });
                        $scope.searchSpinner = false;
                        if (error) {
                            document.querySelector('#graphic-horas').innerHTML = "";
                            $scope.t = true;
                            $scope.searchSpinner = false;
                            $scope.ScrollToDown();
                            $scope.message = "Nenhum registro encontrado pela pesquisa!";
                        } else {
                            $scope.ScrollToDown();
                            $scope.searchSpinner = false;
                        }
                    } else {
                        document.querySelector('#graphic-horas').innerHTML = "";
                        $scope.t = true;
                        $scope.searchSpinner = false;
                        $scope.ScrollToDown();
                        $scope.message = "Nenhum registro encontrado pela pesquisa!";
                    }
                } else {
                    document.querySelector('#graphic-horas').innerHTML = "";
                    $scope.show = true;
                    $scope.t = true;
                    $scope.searchSpinner = false;
                    $scope.ScrollToDown();
                    $scope.message = "Nenhum registro encontrado para o período pesquisado.";
                }
            }, function(err) {
                document.querySelector('#graphic-horas').innerHTML = "";
                $scope.t = true;
                $scope.message = "Nenhum registro encontrado para o período pesquisado.";
                console.log(err);
            })
        }, function(err) {
            document.querySelector('#graphic-horas').innerHTML = "";
            $scope.t = true;
            $scope.message = "Nenhum registro encontrado para o período pesquisado.";
            console.log(err);
        })
    };

    $scope.ScrollToDown = () => {
        let headerHeight = document.querySelector('.header-container').offsetHeight;
        let menu = document.querySelector('.menu-equipe').offsetHeight;
        let nav = document.querySelector('.nav-options').offsetHeight;
        let cont = document.querySelector('.cont').offsetHeight;
        let heightFull = (parseFloat(headerHeight) + parseFloat(menu) + parseFloat(nav) + parseFloat(cont)) + 400;
        $window.scrollTo(0, heightFull);
    };

    const createOptions = (lista, listName) => {
        let slc = `<select id="select" ng-model="selectedItem" class="${listName}"></select>`;
        let container = document.querySelector('.container-search');
        container.innerHTML = slc;
        let seletor = `.${listName}`;
        let select = document.querySelector(seletor);
        lista.forEach(item => {
            let option = document.createElement("option");
            option.text = item;
            option.value = item;
            select.add(option, select[0]);
        });
        container.appendChild(select);
    };

    $scope.search = function() {
        let value = document.querySelector('.estruturas').value;
        $scope.makeSearch('Cliente', value);
    };

});