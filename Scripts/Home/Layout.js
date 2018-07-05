function AlterarSenha() {
    $('#Embaca').show();
    $("#divAlterarSenha").show();
    $('#ModalAlterarSenha').modal('show');
}

function FechaAlteraSenha() {
    $("#divAlterarSenha").hide();
    $('#Embaca').hide();
    document.querySelector('.modal').innerHTML = "";
}

function ResetSenhaUsuario() {        
    if ($("#novaSenhaUsuario").val() === "") {
        alert("Nova Senha não pode ser Branca");
        document.querySelector('.content-loader').innerHTML = `
            <div class="row">
            <div class="col-lg-12">
            <div>
                <p>Nova Senha:</p>
                <input type="password" id="novaSenhaUsuario" class="text" style="width: 100%;" />
            </div>
            <div>
                <p>Confirmação de senha:</p>
                <input type="password" id="confirmaSenha" class="text" style="width: 100%;"/>
            </div>
            </div>
            </div>
            <div class="row" style="margin-top: 1.5em;">
                <div class="col-lg-12">
                <input type="button" id="AlterarSenha" class="input form-control btn btn-success" placeholder="Altar a Senha" value="Alterar Senha" onclick="ResetSenhaUsuario();" />
                </div>
            </div>
        `;
    } else {
        var pdata = {};
        pdata["idUsuario"] = localStorage.getItem('idSearch');
        let senha = document.querySelector('#novaSenhaUsuario').value;
        let confirma = document.querySelector('#confirmaSenha').value;
        document.querySelector('.content-loader').innerHTML = `<div class="loader loader-menu loader-black"></div>`;    
        if (senha === confirma) {
            pdata["novaSenha"] = senha;
            $.getJSON($("#ResetarSenhaUsuarioURL").val(), pdata, function (data) {
                if (data.Result) {
                    alert("Senha resetada com sucesso!");
                    $('#ModalAlterarSenha').modal('hide');
                    FechaAlteraSenha();
                } else {
                    alert("Falha ao tentar resetar a senha!");
                    document.querySelector('.content-loader').innerHTML = `
                        <div class="row">
                        <div class="col-lg-12">
                        <div>
                            <p>Nova Senha:</p>
                            <input type="password" id="novaSenhaUsuario" class="text" style="width: 100%;" />
                        </div>
                        <div>
                            <p>Confirmação de senha:</p>
                            <input type="password" id="confirmaSenha" class="text" style="width: 100%;"/>
                        </div>
                        </div>
                        </div>
                        <div class="row" style="margin-top: 1.5em;">
                            <div class="col-lg-12">
                            <input type="button" id="AlterarSenha" class="input form-control btn btn-success" placeholder="Altar a Senha" value="Alterar Senha" onclick="ResetSenhaUsuario();" />
                            </div>
                        </div>
                    `;
                }
            });
        } else {
            alert('As senhas precisam ser iguais!');
        }
    }
}

function CarregaMenu(usuarioId) {
    console.log('O menu está carregando:');
    var pdata = {};
    pdata["usuarioId"] = usuarioId;
    var textMenu = "";
    console.log($("#BuscaTelaURL").val());
    $.getJSON($("#BuscaTelaURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                textMenu += `<a href="/${dados.tel_Controller}/${dados.tel_Metodo}">${dados.tel_Descricao}</a>`;
            });
            console.log(textMenu);
            $("#MenuCompleto").html(textMenu);
        }
    });
}

function ValidaEmail(email) {
    var sEmail = email;
    // filtros
    var emailFilter = /^.+@.+\..{2,}$/;
    var illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]]/
    // condição
    if (!(emailFilter.test(sEmail)) || sEmail.match(illegalChars)) {
        return false;
    } else {
        return true;
    }
}

function parseJsonDate(jsonDateString) {
    return dataAtualFormatada(new Date(parseInt(jsonDateString.replace('/Date(', ''))));
}

function parseJsonDateTime(jsonDateString) {
    return dataHoraAtualFormatadaBrasil(new Date(parseInt(jsonDateString.replace('/Date(', ''))));
}

function parseJsonAmericanDate(jsonDateString) {
    return dataAtualFormatadaAmericano(new Date(parseInt(jsonDateString.replace('/Date(', ''))));
}

function dataHoraAtualFormatadaAmericano(data) {
    var dia = data.getDate();
    if (dia.toString().length == 1)
        dia = "0" + dia;
    var mes = data.getMonth() + 1;
    if (mes.toString().length == 1)
        mes = "0" + mes;
    var ano = data.getFullYear();
    var hora = data.getHours();
    if (hora.toString().length == 1)
        hora = "0" + hora;
    var minuto = data.getMinutes();
    if (minuto.toString().length == 1)
        minuto = "0" + minuto;
    var segundo = data.getSeconds();
    if (segundo.toString().length == 1)
        segundo = "0" + segundo;

    return ano + "-" + mes + "-" + dia + " " + hora + ":" + minuto + ":" + segundo;
}

function dataHoraAtualFormatadaBrasil(data) {
    var dia = data.getDate();
    if (dia.toString().length == 1)
        dia = "0" + dia;
    var mes = data.getMonth() + 1;
    if (mes.toString().length == 1)
        mes = "0" + mes;
    var ano = data.getFullYear();
    var hora = data.getHours();
    if (hora.toString().length == 1)
        hora = "0" + hora;
    var minuto = data.getMinutes();
    if (minuto.toString().length == 1)
        minuto = "0" + minuto;
    var segundo = data.getSeconds();
    if (segundo.toString().length == 1)
        segundo = "0" + segundo;

    return dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
}

function dataAtualFormatadaAmericano(data) {
    var dia = data.getDate();
    if (dia.toString().length == 1)
        dia = "0" + dia;
    var mes = data.getMonth() + 1;
    if (mes.toString().length == 1)
        mes = "0" + mes;
    var ano = data.getFullYear();
    return ano + "-" + mes + "-" + dia;
}

function dataAtualFormatada(data) {
    var dia = data.getDate();
    if (dia.toString().length == 1)
        dia = "0" + dia;
    var mes = data.getMonth() + 1;
    if (mes.toString().length == 1)
        mes = "0" + mes;
    var ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
}

function numberParaReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};
