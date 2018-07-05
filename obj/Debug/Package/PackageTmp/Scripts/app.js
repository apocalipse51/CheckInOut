angular.module('checkin', ['ngRoute', 'angularUtils.directives.dirPagination']).config(function($routeProvider) {
    $routeProvider.when('/relatorio', {
        templateUrl: 'partials/relatorio.html',
        controller: 'RelatorioController'
    }).when('/horas', {
        templateUrl: 'partials/horas.html',
        controller: 'HorasController'
    }).when('/outliers', {
        templateUrl: 'partials/outliers.html',
        controller: 'OutliersController'
    }).when('/horas-equipe/relatorio', {
        templateUrl: 'partials/relatorio-equipe.html',
        controller: 'EquipeRelatorio'
    }).when('/horas-equipe/horas', {
        templateUrl: 'partials/horas-equipe.html',
        controller: 'EquipeHoras'
    }).when('/horas-equipe/outliers', {
        templateUrl: 'partials/outliers-equipe.html',
        controller: 'EquipeOutliers'
    }).when('/horas-equipe/estrutura', {
        templateUrl: 'partials/estrutura.html',
        controller: 'EstruturaController'
    }).when('/horas-equipe/projeto', {
        templateUrl: 'partials/projeto.html',
        controller: 'ProjetoController'
    }).when('/horas-equipe/produto', {
        templateUrl: 'partials/produto.html',
        controller: 'ProdutoController'
    }).when('/horas-equipe/cliente', {
        templateUrl: 'partials/cliente.html',
        controller: 'ClientesController'
    }).otherwise({ redirectTo: '/' });
}).run(['$rootScope', function($rootScope) {

    $rootScope.GraphLine = function(listHours, title) {
        let head = listHours.Estrutura;
        let estrutura = head.replace(/\s/g, '');
        let recursos = listHours.Recursos;
        if (recursos.length > 0) {
            let horasContainer = document.querySelector('#graphic-horas');
            let dv = `
            <div class="col-sm-12 col-md-12 col-lg-12 out-graph" style="margin-top: 1em;">
                <p class="title-out">Equipe - ${head}</p>
                <div id="${estrutura}-div" class="line-graph">
                </div>
            </div>
        `;
            horasContainer.innerHTML += dv;
            let chartContainer = `${estrutura}-div`;
            google.charts.load('current', { packages: ['corechart', 'line'] });
            google.charts.setOnLoadCallback(drawCurveTypes);

            function drawCurveTypes() {
                let data = new google.visualization.DataTable();
                data.addColumn('string', 'Nome');
                data.addColumn('number', 'Horas');
                data.addColumn('number', 'Meta');
                data.addRows(recursos);
                let options = {
                    hAxis: {
                        title: `Equipe - ${head}`
                    },
                    vAxis: {
                        title: `Relatório de ${title}`
                    },
                    pointSize: 4,
                    series: {
                        0: { pointShape: 'circle' },
                        1: { curveType: 'function' }
                    }
                };
                let chart = new google.visualization.LineChart(document.getElementById(chartContainer));
                google.visualization.events.addListener(chart, 'ready', function() {
                    save(chart.getImageURI(), chartContainer);
                });
                chart.draw(data, options);
            }
            google.charts.setOnLoadCallback(drawCurveTypes);
        }
    };

    $rootScope.GraphOutlier = (listHours, title = "Horas") => {
      let head = listHours.Estrutura;
      let estrutura = head.replace(/\s/g, '');
      let acima = listHours.Acima;
      let abaixo = listHours.Abaixo;
      if (acima.length > 0) {
        let title = document.querySelector('.graph-title-major');
        if(title.classList.contains('hide')){
            title.classList.remove('hide');
        }
        let major = document.getElementById("graphic-outliers-major");
        let dv = `
            <div class="col-sm-12 col-md-12 col-lg-12 out-graph" style="margin-top: 1em;">
                <p class="title-out">Equipe - ${head}</p>
                <div id="${estrutura}-div" class="line-graph">
                </div>
            </div>
        `;
        major.innerHTML += dv;
        let outContainer = `${estrutura}-div`;
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawCurveTypes);
        function drawCurveTypes() {
            let data = new google.visualization.DataTable();
            data.addColumn('string', 'Nome');
            data.addColumn('number', 'Horas');
            data.addColumn('number', 'Meta');
            data.addRows(acima);
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
      if (abaixo.length > 0) {
        let title = document.querySelector('.graph-title-minor');
        if(title.classList.contains('hide')){
            title.classList.remove('hide');
        }
        let minor = document.getElementById("graphic-outliers-minor");
        let dv = `
            <div class="col-sm-12 col-md-12 col-lg-12 out-graph" style="margin-top: 1em;">
                <p class="title-out">Equipe - ${head}</p>
                <div id="${estrutura}-dv" class="line-graph">
                </div>
            </div>
        `;
        minor.innerHTML += dv;
        let outContainer = `${estrutura}-dv`;
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawCurveTypes);
        function drawCurveTypes() {
            let data = new google.visualization.DataTable();
            data.addColumn('string', 'Nome');
            data.addColumn('number', 'Horas');
            data.addColumn('number', 'Meta');
            data.addRows(abaixo);
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
    }

    $rootScope.GetStructuredList = function(heads, dataset) {
        let arr = [];
        heads.forEach(x => {
            let estrutura = x;
            let itSelf = [];
            dataset.forEach(c => {
                if (c.Estrutura.toLowerCase() === estrutura.toLowerCase()) {
                    let rec = [c.Nome, parseFloat(c.Tempo), parseFloat(c.Meta)];
                    itSelf.push(rec);
                }
            });
            arr.push({ Estrutura: estrutura, Recursos: itSelf });
        });
        return arr;
    };

    $rootScope.GetHoursAltered = function(dataset) {
        let meta = window.localStorage.getItem('diasUteis');
        meta = JSON.parse(meta);
        meta = meta.horas;
        meta = `${meta}:00:00`;
        let nomesRecursos = dataset.map(x => x.Nome);
        nomesRecursos = nomesRecursos.filter(function(este, i) {
            return nomesRecursos.indexOf(este) === i;
        });
        //Define os datasets
        let l2 = dataset;
        let arr = [];
        nomesRecursos.forEach(x => {
            let nome = x;
            let tempo = "00:00:00:";
            let estrutura;
            l2.forEach(c => {
              if (c.Nome === x) {
                //Organiza a estrutura
                estrutura = estrutura ? estrutura : c.Estrutura;
                //Valida os casos de uso
                let casoPadrao = c.Motivo === "";
                let somaDeJustificativa = ((c.Motivo === "Atividade retroativa") || (c.Motivo === "Esqueceu de fazer check in/out")) && c.Aprovacao == "Aprovada";
                let diminuiOTarget = c.Aprovacao === "Aprovada";
                //Executa a lógica de soma de tempo
                if(casoPadrao) {
                  tempo = SumTime(tempo, c.Tempo);
                } else if (somaDeJustificativa) {
                  tempo = SumTime(tempo, c.Tempo);
                } else if(diminuiOTarget) {
                  meta = SubtractTime(meta, c.Tempo);
                }
              }
            });
            let tp = tempo.split(":");
            tp = parseFloat(`${tp[0]}.${tp[1]}`);
            let target = meta.split(":");
            target = parseFloat(`${target[0]}.${target[1]}`);
            arr.push({ Nome: nome, Tempo: parseFloat(tp), Meta: parseFloat(target), Estrutura: estrutura });
        });
        return arr;
    };

    $rootScope.GetList = function(names, head, list) {
      let arr = [];
      let meta = JSON.parse(window.localStorage.getItem('diasUteis'));
      meta = meta.horas;
      names.forEach(x => {
        let name = x;
        let tempo = "00:00:00";
        list.forEach(c => {
          tempo = SumTime(tempo, c.Tempo);
        });
        arr.push([name, parseFloat(tempo), parseFloat(meta)]);
      });
      return { Estrutura: head, Recursos: arr};
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
    };

    function SubtractTime(hrA, hrB) {
      let i = hrA.split(":");
      i[0] = Math.round(parseFloat(i[0]));
      i[1] = Math.round(parseFloat(i[1]));
      let f = hrB.split(":");
      f[0] = Math.round(parseFloat(f[0]));
      f[1] = Math.round(parseFloat(f[1]));
      let iT = (parseInt(i[0]) * 60) + parseInt(i[1]);
      let fT = (parseInt(f[0]) * 60) + parseInt(f[1]);

      if(fT <= 0) {
        return hrA;
      } else if(iT <= fT) {
        return "00:00:00";
      } else {
        let sum = parseInt(iT) - parseInt(fT);
        let calcH = sum / 60;
        calcH = calcH.toFixed(2);
        let minutos, horas;
        if((sum % 60) == 0) {
          calcH = calcH+"";
          let arr = calcH.split(".");
          horas = arr[0];
          minutos = "00";
        } else {
          calcH = calcH+"";
          let arr = calcH.split(".");
          horas = (arr[0] < 10) ? "0"+arr[0] : arr[0];
          minutos = (arr[1] < 10) ? "0"+arr[1] : arr[1];
        }
        return `${horas}:${minutos}:00`;
      }
		}

    $rootScope.Filtrar = (head, usuarioHoras, nomes, recursos, usuarioNome) => {
      let meta = window.localStorage.getItem('diasUteis');
      meta = JSON.parse(meta);
      meta = meta.horas;
      meta = `${meta}:00:00`;
      let list = usuarioHoras.concat(recursos);
      let lista = {};
      lista.Estrutura = usuarioNome;
      let names = nomes.concat(usuarioNome);
      let arr = [];
      names.forEach(x => {
        let name = x;
        let tempo = "00:00:00";
        list.forEach(c => {
          if(c.Nome === name) {
            //Valida os casos de uso
            let casoPadrao = c.Motivo === "";
            let somaDeJustificativa = ((c.Motivo === "Atividade retroativa") || (c.Motivo === "Esqueceu de fazer check in/out")) && c.Aprovacao == "Aprovada";
            let diminuiOTarget = c.Aprovacao === "Aprovada";
            //Executa a lógica de soma de tempo
            if(casoPadrao) {
              tempo = SumTime(tempo, c.Tempo);
            } else if (somaDeJustificativa) {
              tempo = SumTime(tempo, c.Tempo);
            } else if(diminuiOTarget) {
              meta = SubtractTime(meta, c.Tempo);
            }
          }
        });
        let target = meta.split(":");
        target = `${target[0]}.${target[1]}`;
        arr.push([name, parseFloat(tempo), parseFloat(target)]);
      });
      lista.Recursos = arr
      return lista;
    }

    $rootScope.Filter = (structure, headsList, namesList, resources) => {
      let meta = JSON.parse(window.localStorage.getItem('diasUteis'));
      let list = structure.concat(resources);
      let head = unique(headsList);
      let lista = {};
      lista.Estrutura = head[0];
      let names = namesList.concat(head);
      let arr = [];
      names.forEach(x => {
        let target = meta.horas;
        let name = x;
        let tempo = "00:00:00";
        list.forEach(c => {
          if(c.Nome === name) {
            tempo = SumTime(tempo, c.Tempo);
          }
        });
        arr.push([name, parseFloat(tempo), parseFloat(target)]);
      });
      lista.Recursos = arr
      return lista;
    }

    $rootScope.FilterOutliers = (head, usuarioHoras, nomes, recursos, usuarioNome) => {
      let meta = window.localStorage.getItem('diasUteis');
      meta = JSON.parse(meta);
      let percent = (parseFloat(meta.horas) / 100) * 20;
      meta = meta.horas;
      meta = `${meta}:00:00`;
      let list = usuarioHoras.concat(recursos);
      let lista = {};
      lista.Estrutura = usuarioNome;
      let names = nomes.concat(usuarioNome);
      let arrAcima = [];
      let arrAbaixo = [];
      names.forEach(x => {
        let name = x;
        let tempo = "00:00:00";
        list.forEach(c => {
          if(c.Nome === name) {
            //Valida os casos de uso
            let casoPadrao = c.Motivo === "";
            let somaDeJustificativa = ((c.Motivo === "Atividade retroativa") || (c.Motivo === "Esqueceu de fazer check in/out")) && c.Aprovacao == "Aprovada";
            let diminuiOTarget = c.Aprovacao === "Aprovada";
            //Executa a lógica de soma de tempo
            if(casoPadrao) {
              tempo = SumTime(tempo, c.Tempo);
            } else if (somaDeJustificativa) {
              tempo = SumTime(tempo, c.Tempo);
            } else if(diminuiOTarget) {
              meta = SubtractTime(meta, c.Tempo);
            }
          }
        });
        let tp = tempo.split(":");
        tp = parseFloat(`${tp[0]}.${tp[1]}`);
        let tgt = meta.split(":");
        tgt = parseFloat(`${tgt[0]}.${tgt[1]}`);
        let acima = parseFloat(tgt) + parseFloat(percent);
        let abaixo = parseFloat(tgt) - parseFloat(percent);
        if(tp > acima) {
          arrAcima.push([name, parseFloat(tempo), parseFloat(tgt)]);
        }
        if(tp < abaixo){
          arrAbaixo.push([name, parseFloat(tempo), parseFloat(tgt)]);
        }
      });
      lista.Acima = arrAcima;
      lista.Abaixo = arrAbaixo;
      return lista;
    }

    $rootScope.GenerateUri = data => {
      let i = new Date(data.inicial);
      let f = new Date(data.final);
      let inicial = `${i.getFullYear()}-${i.getMonth()+1}-${i.getDate()}`;
      let final = `${f.getFullYear()}-${f.getMonth()+1}-${f.getDate()}`;
      return `?DtInicio=${inicial}&DtFim=${final}`;
    }

    function save(imgData, seletor) {
        //Seleciona o container do link de download da tabela
        let container = document.getElementById(seletor);
        //Verifica se ja existe um link no container
        //Isso pode ocorrer caso o usuário faça uma nova pesquisa
        try {
            let linkOld = container.querySelector('a');
            if (linkOld) {
                linkOld.remove();
            }
        } catch (ex) {
            console.log('Elemento nao encontrado! Erro ao disponibilizar gráfico para download.');
        }
        //Define a metadata da tabela
        let gh = imgData;
        //Cria o link de download
        let a = document.createElement('a');
        a.href = gh;
        a.textContent = "Download PNG";
        a.classList.add('link-outliers');
        a.download = 'image.png';
        container.appendChild(a);
    };

    $rootScope.FilterField = function(field, value, list) {
        let arr = [];
        list.forEach(x => {
            if (x[field].toLowerCase() === value.toLowerCase()) {
                arr.push(x);
            }
        });
        return arr;
    };

    $rootScope.ConsolidateStructure = function(name, list) {
        let arr = [];
        name.forEach(x => {
            let structure = {
                Nome: x,
                Recursos: []
            };
            let temp = [];
            list.forEach(c => {
                if (x === c.EstruturaNome) {
                    temp = temp.concat(c.Recursos);
                }
            })
            structure.Recursos = temp;
            arr.push(structure);
        });
        return arr;
    };

    $rootScope.Unique = function(arr) {
        arr = arr.filter((este, i) => {
            return arr.indexOf(este) === i;
        });
        return arr;
    };

    const unique = function(arr) {
        arr = arr.filter((este, i) => {
            return arr.indexOf(este) === i;
        });
        return arr;
    };

    $rootScope.Structure = function(list, structure) {
        //this will be an array of structures
        let arr = [];
        structure.forEach(x => {
            let stru = {
                Estrutura: x.Nome,
                Recursos: []
            }
            let temp = [];
            list.forEach(c => {
                if (x.Nome === c.Estrutura) {
                    temp = temp.concat(c);
                }
            })
            stru.Recursos = temp;
            arr.push(stru);
        })
        return arr;
    };

    $rootScope.ErrorInfo = () => {
        $scope.searchSpinner = false;
        $scope.show = false;
        $scope.message = "Um erro inesperado ocorreu! Tente mais tarde.";
    };

    $rootScope.GetHours = (head, dataset) => {
        let meta = window.localStorage.getItem('diasUteis');
        meta = JSON.parse(meta);
        meta = meta.horas;
        let estrutura = head;
        let nomesRecursos = dataset.map(x => x.Nome);
        nomesRecursos = nomesRecursos.filter(function(este, i) {
            return nomesRecursos.indexOf(este) === i;
        });
        let l2 = dataset;
        let arr = [];
        nomesRecursos.forEach(x => {
            let nome = x;
            let tempo = "00:00:00:";
            l2.forEach(c => {
                tempo = SumTime(tempo, c.Tempo);
            });
            let horas = tempo.substring(0, 2);
            let minutos = tempo.substring(3, 2);
            tempo = `${horas}.${minutos}`;
            arr.push([nome, parseFloat(tempo), parseFloat(meta)]);
        });
        return { Estrutura: head, Recursos: arr };
    };
        
}]);
