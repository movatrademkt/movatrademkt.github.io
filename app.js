var valores = {
  MENSAIS: {
    Residencial: 0.27,
    Bolsa: 0.07,
    "Proteção I": 0.07,
    "Proteção II": 0.17,
    "Proteção III": 0.28,
    Funeral: 0.14,
  },
  SAÚDE: {
    Odonto: 0.41,
    "Cuidar Mais I": 0.35,
    "Cuidar Mais F": 1.10,
  },
};

var calculos = {
  _ajuste: 0.8,
  VendasMensais: 0,
  RemuneracaoMensais: 0.0,
  VendasSaude: 0,
  RemuneracaoSaude: 0.0,
};

init = function () {
  for (grupo in valores) {
    var _t = $(`<table id="tb${grupo}" data-grupo="${grupo}" class="table table-sm table-striped">
            <thead>
                <tr>
                    <th colspan=3>${grupo}</th>
                </tr>
            </thead>
        </table>`);
    var _tbody = $("<tbody>");

    for (val in valores[grupo]) {
      var _id = val.replace(" ", "_");

      _tr = $(`<tr id="${_id}">`).data({
        nome: val,
        valor: valores[grupo][val],
      });
      _tr
        .append($(`<td>${val}</td>`))
        .append(
          $(
            `<td><input type="number" class="form-control" min="0" id="txt_${_id}"></td>`
          )
        )
        .append($(`<td class="result">-</td>`));
      _tbody.append(_tr);
    }
    _t.append(
      
    );

    _t.append(_tbody).appendTo($("#formulario"));
  }

  $("#formulario input[type=number]").change(function (ev) {
    var _tr = $(this).closest("tr");
    var _vendas = parseInt($(this).val());
    _tr.find(".result").text((_vendas * _tr.data().valor).toFixed(2));

    calcula();
  });

  $("#cancelamentoMensais, #cancelamentoSaude, #cboMeses").change(function (ev) {
    calcula();
  });
};

calcula = function () {
  $("#formulario > table").each(function () {
    var _somaVendas = 0,
      _somaRemuneracao = 0;
    var _t = $(this);
    _t.find("input[type=number]").each(function () {
      console.log($(this).val());
      _somaVendas += parseInt($(this).val() == "" ? "0" : $(this).val());
      console.log(  _somaVendas);

    });

    _t.find(".result").each(function () {
      if (!isNaN($(this).text())) {
         _somaRemuneracao += parseFloat($(this).text());

        // _somaRemuneracao += 'R$ 1';
        console.log( _somaRemuneracao);

      }
      // _somaVendas+=  parseInt($(this).val()==""?'0':$(this).val() );
    });

    _t.find(".soma-vendas").text(_somaVendas.toFixed(2));
    _t.find(".soma-valores").text(_somaRemuneracao.toFixed(2));

    if (_t.data("grupo") == "MENSAIS") {
      calculos.VendasMensais = _somaVendas;
      calculos.RemuneracaoMensais = _somaRemuneracao;
    } else {
      calculos.VendasSaude = _somaVendas;
      calculos.RemuneracaoSaude = _somaRemuneracao;

     }
  });

  display();
};

geraProjecaoMensais = function (qtd) {
  var meses = [];
  for (i = 0; i < qtd; i++) {
    if (i == 0) {
      meses[i] =
        calculos.VendasMensais *
        (1 - parseInt($("#cancelamentoMensais").val()) / 100) *
        calculos._ajuste;
    } else {
      meses[i] =
        meses[i - 1] *
        (1 - parseInt($("#cancelamentoMensais").val()) / 100) *
        calculos._ajuste;
    }
  }

  var soma = 0;
  for (i = 0; i < meses.length; i++) {
    for (x = 0; x < meses.length - i; x++) {
      soma += meses[x];
    }
  }
  return (
    soma *
    (calculos.RemuneracaoMensais / calculos.VendasMensais)
  ).toFixed(2);
};

geraProjecaoSaude = function (qtd) {
  var meses = [];
  for (i = 0; i < qtd; i++) {
    if (i == 0) {
      meses[i] =
        calculos.VendasSaude *
        (1 - parseInt($("#cancelamentoSaude").val()) / 100) *
        calculos._ajuste;
    } else {
      meses[i] =
        meses[i - 1] *
        (1 - parseInt($("#cancelamentoSaude").val()) / 100) *
        calculos._ajuste;
    }
  }

  var soma = 0;
  for (i = 0; i < meses.length; i++) {
    for (x = 0; x < meses.length - i; x++) {
      soma += meses[x];
    }
  }
  return (soma * (calculos.RemuneracaoSaude / calculos.VendasSaude)).toFixed(2);
};

display = function () {

  let soma_vendas = (calculos.VendasMensais + calculos.VendasSaude);

  $(".mensais.soma-vendas").text( calculos.VendasMensais);
  $(".mensais.soma-remuneracao").text('R$ ' + calculos.RemuneracaoMensais.toFixed(2));
  $(".saUde.soma-vendas").text( calculos.VendasSaude);
  $(".saUde.soma-remuneracao").text('R$ ' + calculos.RemuneracaoSaude.toFixed(2));
  // $(".total.soma-vendas").text(calculos.VendasMensais + calculos.VendasSaude);
  $(".total.soma-vendas").text(soma_vendas);

  $(".total.soma-remuneracao").text( 'R$ ' + 
    (calculos.RemuneracaoMensais + calculos.RemuneracaoSaude).toFixed(2)
  );

  var _projecaoMensais = geraProjecaoMensais(parseInt($("#cboMeses").val()));
  var _projecaoSaude = geraProjecaoSaude(parseInt($("#cboMeses").val()));

  $("#projecaoMensais").text(isNaN(_projecaoMensais) ? "-" : "R$ " + _projecaoMensais);
  $("#projecaoSaude").text(isNaN(_projecaoSaude) ? "-" : "R$ " + _projecaoSaude);
  
  $("#projecaoTotal").text("R$ "+
      (
    (isNaN(_projecaoMensais) ? 0 : parseFloat(_projecaoMensais)) + 
    (isNaN(_projecaoSaude) ? 0 :  parseFloat(_projecaoSaude))  
    ).toFixed(2)
      );


};