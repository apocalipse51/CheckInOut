angular.module('checkin').controller('EquipeOutliers', function($scope, $http) {
    
    $scope.searchSpinner = true;
    $scope.show = true; 

    $scope.searchSpinner = true;
    $scope.show = true;

    const uri = window.localStorage.getItem('rangeDePesquisa');
    const id = window.localStorage.getItem('idSearch');
    let service = `/HorasEquipe/ReportHorasCompleto${uri}`;
    
    (function() {
        $http.get('/horasequipe/estrutura').then(function(data) {
            $http.get('/HorasEquipe/heads').then(function(res) {
                $http.get('/HorasEquipe/HeadsId').then(function(result) {
                    $http.get(service).then(function(r) {
                        if(r.data.Result.length > 0){
                            //Here i got the list of structures
                            $scope.heads = $scope.Unique(res.data.Result);
                            $scope.lista = r.data.Result;
                            //Here i got the list of users with structure, time and goal
                            $scope.preFilter = $scope.GetHoursAltered($scope.lista);
                            $scope.list = $scope.GetStructuredList($scope.heads, $scope.preFilter);                            
                            $scope.listHoursMinor = GetListOutLiersMinor($scope.list);                                                                                                         
                            $scope.listHoursMajor = GetListOutLiersMajor($scope.list);                                                  
                            $scope.GraphLineMajor($scope.listHoursMajor);
                            $scope.GraphLineMinor($scope.listHoursMinor);                            
                            $scope.searchSpinner = false;
                        } else {
                          $scope.searchSpinner = false;
                          $scope.show = false;
                          $scope.message = "Nenhum registro encontrado para o período pesquisado.";
                        }
                    }, function(err) {
                        console.log(err);
                    })
                }, function(err) {
                    console.log(err);
                })
            }, function(err) {
                console.log(err);
            })
        }, function(err) {
            console.log(err);
        });
    }());

    function GetListOutLiersMinor(dataset) {        
        let meta = window.localStorage.getItem('diasUteis');
        meta = JSON.parse(meta);
        meta = meta.horas;
        let percent = (meta / 100) * 20;
        let tempo = meta - percent;
        let arr = []        
        dataset.forEach(x => {
            let head = x.Estrutura;
            let a = [];
            x.Recursos.forEach(c => {
                if(c[1] < tempo) {
                    a.push(c);
                }
            });
            if(a.length > 0) {
                arr.push({Estrutura: head, Recursos: a});   
            }
        });                     
        return arr;
    }

    function GetListOutLiersMajor(dataset) {    
        let meta = window.localStorage.getItem('diasUteis');
        meta = JSON.parse(meta);
        meta = meta.horas;
        let percent = (meta / 100) * 20;
        let tempo = meta + percent;
        let arr = [];
        dataset.forEach(x => {            
            let head = x.Estrutura;
            let a = [];
            x.Recursos.forEach(c => {
                if(c[1] >= tempo) {
                    a.push(c);
                }
            });
            if(a.length > 0) {
                arr.push({Estrutura: head, Recursos: a});
            }
        });
        return arr;
    }    

    function SumTime(tempo1, tempo2) {
        let array1 = tempo1.split(':');
        let tempo_seg1 = (parseInt(array1[0]) * 3600) + (parseInt(array1[1]) * 60) + parseInt(array1[2]);
        let array2 = tempo2.split(':');
        let tempo_seg2 = (parseInt(array2[0]) * 3600) + (parseInt(array2[1]) * 60) + parseInt(array2[2]);
        let tempofinal = parseInt(tempo_seg1) + parseInt(tempo_seg2);
        let hours = Math.floor(tempofinal / (60 * 60));
        let divisorMinutos = tempofinal % (60 * 60);
        let minutes = Math.floor(divisorMinutos / 60);
        let divisorSeconds = divisorMinutos % 60;
        let seconds = Math.ceil(divisorSeconds);
        let contador = "";
        if (hours < 10) { contador = "0" + hours + ":"; } else { contador = hours + ":"; }
        if (minutes < 10) { contador += "0" + minutes + ":"; } else { contador += minutes + ":"; }
        if (seconds < 10) { contador += "0" + seconds; } else { contador += seconds; }
        return contador;
    }

    function save(imgData, seletor) {
        //Seleciona o container do link de download da tabela
        let container = document.getElementById(seletor);                
        //Verifica se ja existe um link no container
        //Isso pode ocorrer caso o usuário faça uma nova pesquisa 
        try {
            let linkOld = container.querySelector('a');                
            if(linkOld){
                linkOld.remove();
            }
        }
        catch (ex)
        {   
            console.log('Elemento nao encontrado!');
        }
        //Define a metadata da tabela
        let gh = imgData;
        //Cria o link de download 
        let a  = document.createElement('a');            
        a.href = gh;
        a.textContent = "Download PNG";
        a.classList.add('link-outliers');
        a.download = 'image.png';
        container.appendChild(a);
    }

    $scope.GraphLineMajor = function(major) {
        if(major.length > 0) {            
            major.forEach(ma => {
                let head = ma.Estrutura;
                let resources = ma.Recursos;                         
                let estrutura = head.replace(/\s/g,'');                         
                if(resources.length > 0) {
                    let title = document.querySelector('.graph-title-major');
                    if(title.classList.contains('hide')){
                        title.classList.remove('hide');
                    }                
                    let m = document.getElementById("graphic-outliers-major");                     
                    let dv = `
                        <div class="col-sm-12 col-md-12 col-lg-12 out-graph" style="margin-top: 1em;">
                            <p class="title-out">Equipe - ${head}</p>
                            <div id="${estrutura}-div" class="line-graph">
                            </div>
                        </div>
                    `;
                    m.innerHTML += dv;
                    let outContainer = `${estrutura}-div`; 
                    google.charts.load('current', {packages: ['corechart', 'line']});
                    google.charts.setOnLoadCallback(drawCurveTypes);
                    function drawCurveTypes() {
                        let data = new google.visualization.DataTable();
                        data.addColumn('string', 'Nome');          
                        data.addColumn('number', 'Horas');
                        data.addColumn('number', 'Meta'); 
                        data.addRows(resources);
                        let options = {
                            hAxis: {
                                title: `Equipe - ${head}`
                            },
                            vAxis: {
                                title: 'Relatoório de outliers'
                            },
                            pointSize: 4,
                            series: {
                                0: {pointShape: 'circle'},
                                1: {curveType: 'function'}
                            }
                        };                        
                        let chart = new google.visualization.LineChart(document.getElementById(outContainer));  
                        google.visualization.events.addListener(chart, 'ready', function() {                            
                            save(chart.getImageURI(), outContainer);                                                       
                        });
                        chart.draw(data, options);
                    }
                    google.charts.setOnLoadCallback(drawCurveTypes);                                            
                }                 
            });
        }
        $scope.searchSpinner = false;      
    };

    $scope.GraphLineMinor = function(minor) {
        if(minor.length > 0) {   
            minor.forEach(mi => {
                let head = mi.Estrutura;
                let resources = mi.Recursos;                                                             
                let estrutura = head.replace(/\s/g,'');                           
                if(resources.length > 0) {
                    let title = document.querySelector('.graph-title-minor');
                    if(title.classList.contains('hide')){
                        title.classList.remove('hide');
                    }                
                    let m = document.getElementById("graphic-outliers-minor");                    
                    let dv = `
                        <div class="col-sm-12 col-md-12 col-lg-12 out-graph" style="margin-top: 1em;">
                            <p class="title-out">Equipe - ${head}</p>
                            <div id="${estrutura}-dv" class="line-graph">
                            </div>
                        </div>
                    `;
                    m.innerHTML += dv;
                    let outContainer = `${estrutura}-dv`; 
                    google.charts.load('current', {packages: ['corechart', 'line']});
                    google.charts.setOnLoadCallback(drawCurveTypes);
                    function drawCurveTypes() {
                        let data = new google.visualization.DataTable();
                        data.addColumn('string', 'Nome');          
                        data.addColumn('number', 'Horas');
                        data.addColumn('number', 'Meta'); 
                        data.addRows(resources);
                        let options = {
                            hAxis: {
                                title: `Equipe - ${head}`
                            },
                            vAxis: {
                                title: 'Relatoório de outliers'
                            },
                            pointSize: 4,
                            series: {
                                0: {pointShape: 'circle'},
                                1: {curveType: 'function'}
                            }
                        };                        
                        let chart = new google.visualization.LineChart(document.getElementById(outContainer));  
                        google.visualization.events.addListener(chart, 'ready', function() {                            
                            save(chart.getImageURI(), outContainer);                                                       
                        });
                        chart.draw(data, options);
                    }
                    google.charts.setOnLoadCallback(drawCurveTypes);                                          
                }                                      
            });                               
        }
        $scope.searchSpinner = false;            
    };    
});