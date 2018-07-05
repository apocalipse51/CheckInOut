angular.module('checkin').controller('ProdutoController', function($scope, $http, $window) {

    //Infrastructure variables
    const uri = window.localStorage.getItem('rangeDePesquisa');
    const id = window.localStorage.getItem('idSearch');
    const data = JSON.parse(window.localStorage.getItem('datas'));
    $scope.title = "";
    $scope.field = 'Produto';
    $scope.t = true;

    let i = new Date(data.inicial);
    let f = new Date(data.final);
    i = `${i.getFullYear()}-${i.getMonth()+1}-${i.getDate()}`;
    f = `${f.getFullYear()}-${f.getMonth()+1}-${f.getDate()}`; 

    $http.get(`/horasequipe/produtos?DtInicio=${i}&DtFim=${f}`).then(function(res) {
        $scope.options = $scope.Unique(res.data.Result);
        createOptions($scope.options, 'produtos');
        $scope.makeSearch('Produto', $scope.options[0]);
    });

    $scope.makeSearch = function(field, value) {
        $scope.searchSpinner = true;
        let inicial = new Date(data.inicial);
        let final = new Date(data.final);
        inicial = `${inicial.getFullYear()}-${inicial.getMonth()+1}-${inicial.getDate()}`;
        final = `${final.getFullYear()}-${final.getMonth()+1}-${final.getDate()}`;
        let service = `/HorasEquipe/produtosfind?DtInicio=${inicial}&DtFim=${final}&produto=${value}`;                
        $http.get('/HorasEquipe/heads').then(function(res) {
            $http.get(service).then(function(r) {
                if (r.data.Result.length > 0) {
                    document.querySelector('#graphic-horas').innerHTML = "";
                    $scope.message = "";
                    $scope.heads = $scope.Unique(res.data.Result);
                    $scope.lista = r.data.Result;
                    $scope.title = `Relatório de Horas - ${value}`;
                    $scope.preFilter = $scope.GetHoursAltered($scope.lista);
                    let list = $scope.GetStructuredList($scope.heads, $scope.preFilter);
                    if ($scope.lista.length > 0) {
                        $scope.t = false;
                        list.forEach(x => {
                            $scope.GraphLine(x, 'Horas');
                        });
                        $scope.ScrollToDown();
                        $scope.searchSpinner = false;
                    } else {
                        document.querySelector('#graphic-horas').innerHTML = "";
                        $scope.t = true;
                        $scope.searchSpinner = false;
                        $scope.ScrollToDown();
                        $scope.message = "Nenhum registro encontrado pela pesquisa!";
                    }
                } else {
                    document.querySelector('#graphic-horas').innerHTML = "";
                    $scope.t = true;
                    $scope.show = true;
                    $scope.searchSpinner = false;
                    $scope.ScrollToDown();
                    $scope.message = "Nenhum registro encontrado para o período pesquisado.";
                }
            }, function(err) {
                document.querySelector('#graphic-horas').innerHTML = "";
                $scope.t = true;
                console.log(err);
            })
        }, function(err) {
            document.querySelector('#graphic-horas').innerHTML = "";
            $scope.t = true;
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
        let value = document.querySelector('.produtos').value;
        $scope.makeSearch('Produto', value);
    };

});