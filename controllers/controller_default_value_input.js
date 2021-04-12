const path = require('path');
var fs = require('fs')

document.addEventListener('click', function (e) {
  if(e.target && e.target.id== 'add_register'){
    let table = e.target.getAttribute("data-table")
    let table_body = document.getElementsByClassName('table-body')[0]
    table_body.innerHTML = ""

    if (table == "Cadastro") {
      handle_cadastro()

      let peso_kg = document.getElementById('Peso_de_Chegada_em_Kg')
      peso_kg.addEventListener('change', function(e) {
        convert_arroba(e)
        set_tamanho(e)
      })

      let lote = document.getElementById('Lote')
      lote.addEventListener('change', function(e) {
        add_data_chegada(e)
      })

    } else if (table == "Lote") {
      handle_lote()
    }
  }

})

function handle_lote() {
  // data de chegada = dia de hoje
  const date = new Date();
  const today = `${dateValidator(date.getDate())}-${dateValidator(date.getMonth() + 1)}-${date.getFullYear()}`;
  let data_de_chegada = document.getElementById('Data_de_Chegada')
  data_de_chegada.value = today

  // Lote não pode ser preenchido
  let lote_db_relative_path = path.join(path.resolve('.', 'db') + `/lote.json`)

  let lote_db = fs.readFileSync(lote_db_relative_path, 'utf8')
  lote_db = JSON.parse(lote_db)

  let lote = document.getElementById('Lote')
  lote.value = lote_db["next"]
  lote.disabled = true

  return 
}

function handle_cadastro() {
  // lote como um select de todos os lotes que existem
  let lote_db_relative_path = path.join(path.resolve('.', 'db') + `/lote.json`)

  let lote_db = fs.readFileSync(lote_db_relative_path, 'utf8')
  lote_db = JSON.parse(lote_db)

  let lote_ids = lote_db["data"].map(x => x.Lote)
  let lote_div = document.getElementById('modal_input_Lote')
  lote_div.innerHTML = 
  `
    <span class="color-tip color"></span>
    <label>Lote</label>
    <select class="select-lote" id="Lote"></select>
  `
  let select_lote = document.getElementsByClassName('select-lote')[0]
  lote_ids.forEach(function(element) {
    var opt = document.createElement('option');
    opt.value = element;
    opt.innerHTML = element;
    select_lote.appendChild(opt)
  })

  // peso @ desabilitado
  let peso_arroba = document.getElementById('Peso_@')
  peso_arroba.disabled = true

  // tamanho desabilitado
  let tamanho = document.getElementById('Tamanho')
  tamanho.disabled = true

  // Gado ID como o próximo IDasd
  let cadastro_db_relative_path = path.join(path.resolve('.', 'db') + `/cadastro.json`)

  let cadastro_db = fs.readFileSync(cadastro_db_relative_path, 'utf8')
  cadastro_db = JSON.parse(cadastro_db)

  let gado_id = document.getElementById('Gado_ID')
  gado_id.value = cadastro_db["next"]
  
  return 
}


// Utils

// 1-General

// a) between
function between(x, min, max) {
  if (x >= min && x <= max) {
    return true 
  } else {
    return false
  };
}

// a) Today Date
function dateValidator(date) {
  return date < 10 ? "0" + date : date;
}

// 2-Cadastro

// a) convert_arroba
function convert_arroba(event) {
  let peso_arroba = document.getElementById('Peso_@')
  peso_kg = event.target.value
  peso_arroba.value = parseFloat(peso_kg) / 30

  return 
}

// b) set tamanho
function set_tamanho(event) {
  let peso_arroba = document.getElementById('Peso_@').value
  let tamanho = document.getElementById('Tamanho')

  if (between(peso_arroba, 0.00001, 5.5)) {
    return tamanho.value = "U"
  } else if (between(peso_arroba, 5.5, 7)) {
    return tamanho.value = "P"
  } else if (between(peso_arroba, 7, 9)) {
    return tamanho.value = "M"
  } else if (between(peso_arroba, 9, 10000)) {
    return tamanho.value = "G"
  }
}

// c) add data chegada
function add_data_chegada(event) {
  let lote = event.target.value
  let lote_db_relative_path = path.join(path.resolve('.', 'db') + `/lote.json`)

  let lote_db = fs.readFileSync(lote_db_relative_path, 'utf8')
  lote_db = JSON.parse(lote_db)

  let lote_info = lote_db["data"].filter(function (entry) {
    return entry.Lote == lote
  });

  let data_de_chegada = document.getElementById('Data_de_Chegada')
  data_de_chegada.value = lote_info[0]["Data_de_Chegada"]

  return 
}
