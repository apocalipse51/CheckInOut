angular.module('checkin')
.controller('Menu', ['$scope', function($scope) {
    $scope.where = "";

    $scope.individual = {
        horas: '/HorasProjeto/ReportHorasCompleto#!/horas',
        outliers: '/HorasProjeto/ReportHorasCompleto#!/outliers',
        relatorio: '/HorasProjeto/ReportHorasCompleto#!/relatorio'
    };
    $scope.equipe = {
        horas: '/HorasEquipe/Index#!/horas-equipe/horas',
        outliers: '/HorasEquipe/Index#!/horas-equipe/outliers',
        relatorio: '/HorasEquipe/Index#!/horas-equipe/relatorio'
    };
    $scope.search = {
        cliente: '/HorasEquipe/Index#!/horas-equipe/cliente',
        projeto: '/HorasEquipe/Index#!/horas-equipe/projeto',
        produto: '/HorasEquipe/Index#!/horas-equipe/produto',
        estrutura: '/HorasEquipe/Index#!/horas-equipe/estrutura'
    };
    $scope.word = function(wd) {
        $scope.where = wd;
    };
}])
.directive('navOptions', function() {
    return {
        scope: {
            link: '='
        },
        template : `
            <nav class="nav-options" style="background-color: #fff; padding: 1em 2em;">
                <ul>
                    <!--/HorasProjeto/ReportHorasCompleto#!/horas-->
                    <li><a href="{{link.horas}}" class="blue-text text-darken-2">Horas</a></li>
                    <!--/HorasProjeto/ReportHorasCompleto#!/outliers-->
                    <li><a href="{{link.outliers}}" class="blue-text text-darken-2">Outliers</a></li>
                    <!--/HorasProjeto/ReportHorasCompleto#!/relatorio-->
                    <li><a href="{{link.relatorio}}" class="blue-text text-darken-2">Relatório Geral</a></li>
                </ul>
            </nav>
        `,
    };
})
.directive('searchOptions', function() {
    return {
        scope: {
            link: '='
        },
        template : `            
            <nav class="search-options" style="background-color: #fff; padding: 1em 2em;">
                <ul>                    
                    <li><a href="{{link.cliente}}" class="blue-text text-darken-2">Clientes</a></li>
                    <li><a href="{{link.projeto}}" class="blue-text text-darken-2">Projetos</a></li>                    
                    <li><a href="{{link.produto}}" class="blue-text text-darken-2">Produtos</a></li>
                    <li><a href="{{link.estrutura}}" class="blue-text text-darken-2">Estruturas</a></li>
                </ul>                
            </nav>
        `,
    };
})
.directive('menuIndividual', function() {
    return {
        template: `
            <div ng-controller="Menu" class="menu-individual">
                <nav-options link="individual"></nav-options>
            </div>
        `
    }
})
.directive('menuEquipe', function() {
    return {
        template: `
            <div ng-controller="Menu" class="menu-equipe">
                <nav-options link="equipe"></nav-options>
            </div>
        `
    }
})
.directive('menuSearch', function() {
    return {
        template: `
            <div ng-controller="Menu" class="menu-search">
                <search-options link="search"></search-options>                
            </div>
        `
    }
})
.directive('searchSpinner', function() {
    return {
        template: `
            <div class="progress" ng-if="searchSpinner">
                <div class="indeterminate"></div>
            </div>
        `
    }
})
.directive('toolbox', function() {
    return {
        template: `
            <nav-options></nav-options>
            <search-spinner></search-spinner>
        `
    }
})
.directive('info', function() {
    return {
        template: `
            <search-spinner></search-spinner>
            <alert-search></alert-search>
        `
    }
})
.directive('menu', function() {
    return {
        template: `
            <div style="padding: 0; margin: 0;">
                <hr style="background-color: #fff; margin-top: 0;">
                <ul style="margin-bottom: 1em; border-bottom: 1px solid #fff; ">
                    <li ng-repeat="res in itens" style="text-align: center; margin: .5em 0 0 .5em">
                        <a style="color: #fff; cursor: pointer;" ng-click="navigateTo(res.tel_Controller, res.tel_Metodo)">
                            {{res.tel_Descricao}}
                        </a>
                    </li>
                </ul>
            </div>
        `
    }
})
.directive('alertSearch', function() {
    return {
        template: `
            <div ng-if="message">
                <p class="alert-message">{{message}}</p>
            </div>
        `
    }
})