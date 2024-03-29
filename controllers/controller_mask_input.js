document.addEventListener('click', function (e) {
  if(e.target && e.target.id== 'add_register'){
    table = e.target.getAttribute("data-table")

    if (table == "Lote") {
      let data_de_chegada = document.getElementById('Data_de_Chegada')
      let frete = document.getElementById('Frete')
      let comissao = document.getElementById('Comissão')
      let valor_animais = document.getElementById('Valor_Animais')
      let numero_de_animais = document.getElementById('Numero_de_Animais')

      data_de_chegada.dataset.format = "**-**-****"
      data_de_chegada.dataset.mask = "DD-MM-AAAA"

      frete.setAttribute("type", "number")
      comissao.setAttribute("type", "number")
      valor_animais.setAttribute("type", "number")
      numero_de_animais.setAttribute("type", "number")
    } else if (table == "Cadastro") {
      let data_de_chegada = document.getElementById('Data_de_Chegada')
      data_de_chegada.dataset.format = "**-**-****"
      data_de_chegada.dataset.mask = "DD-MM-AAAA"      
    }

    document.querySelectorAll('[data-mask]').forEach(function(e) {
      function format(elem) {
        const val = doFormat(elem.value, elem.getAttribute('data-format'));
        elem.value = doFormat(elem.value, elem.getAttribute('data-format'), elem.getAttribute('data-mask'));
        
        if (elem.createTextRange) {
          var range = elem.createTextRange();
          range.move('character', val.length);
          range.select();
        } else if (elem.selectionStart) {
          elem.focus();
          elem.setSelectionRange(val.length, val.length);
        }
      }
      e.addEventListener('keyup', function() {
        format(e);
      });
      format(e)
    });
  }

})

function doFormat(x, pattern, mask) {
  var strippedValue = x.replace(/[^0-9]/g, "");
  var chars = strippedValue.split('');
  var count = 0;

  var formatted = '';
  for (var i=0; i<pattern.length; i++) {
    const c = pattern[i];
    if (chars[count]) {
      if (/\*/.test(c)) {
        formatted += chars[count];
        count++;
      } else {
        formatted += c;
      }
    } else if (mask) {
      if (mask.split('')[i])
        formatted += mask.split('')[i];
    }
  }
  return formatted;
}