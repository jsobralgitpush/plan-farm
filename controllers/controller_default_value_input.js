document.addEventListener('click', function (e) {
  if(e.target && e.target.id== 'add_register'){
    table = e.target.getAttribute("data-table")

    if (table == "Cadastro") {

    } else if (table == "Lote") {
      mask_lote()
    }
  }

})

function mask_lote () {
  const date = new Date();
  const today = `${dateValidator(date.getDate())}-${dateValidator(date.getMonth() + 1)}-${date.getFullYear()}`;

  let data_de_chegada = document.getElementById('Data_de_Chegada')


  data_de_chegada.value = today
}



// Utils

// a) Today Date
function dateValidator(date) {
  return date < 10 ? "0" + date : date;
}
