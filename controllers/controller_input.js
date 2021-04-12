var fs = require('fs')

lote_columns = ["Lote","Data_de_Chegada","Frete", "Comissão", "Valor_Animais", "Comprador","Numero_de_Animais"]
cadastro_columns = ["Gado_ID", "Lote","Data_de_Chegada", "Peso_de_Chegada_em_Kg", "Peso_@", "Tamanho"]
info_pesagem_columns = ["Numero_Pesagem", "Data_da_Pesagem", "U_inf", "U_sup", "P_inf", "P_sup", "M_inf", "M_sup", "G_inf", "G_sup"]
pesagem_columns = ["Numero_Pesagem", "Gado_ID", "Lote", "Check", "Kg", "Peso_@", "Tamanho", "GMD"]
financeiro_columns = ["Data", "Valor", "Classificação", "Subclassificação", "Comentário"]

columns_array = [
  ["Lote", lote_columns], 
  ["Cadastro", cadastro_columns], 
  ["Info_Pesagem", info_pesagem_columns], 
  ["Pesagem", pesagem_columns],
  ["Financeiro", financeiro_columns]
]

document.addEventListener('click',function(e){
  if(e.target && e.target.id== 'add_register'){
    input_place = document.getElementsByClassName('action')[0]
    action_helper = document.getElementsByClassName('action-helper')[0]
    table_body = document.getElementsByClassName('table-body')[0]
    table_body.innerHTML = ""


    table = e.target.getAttribute("data-table")

    columns_array.forEach(function(item) {
      if (item[0] == table) {
        input_place.innerHTML = `<h1>Novo Registro de ${item[0]}</h1>`
        item[1].forEach(function(sub_item) {
          input_place.innerHTML += `
          <div class="modal-input" id="modal_input_${sub_item}">
            <span class="color-tip color"></span>
            <label>${sub_item}</label>
            <input class='input' id="${sub_item}">
          </div>
          `
        })
      }
    })

    input_place.innerHTML += `<button class=${table} id="save_record">Salvar Dados</button>`

    //  Handle Pesagem Stuff
    if (table == "Pesagem") {
      load_pesagem_info(action_helper)
      
      let calculadora = document.getElementById('calcular')
      
      calculadora.addEventListener('click', function() {
        getMetricasPesagem()
      })
   }

}})


function load_pesagem_info(html) {
  html.innerHTML = 
  `
  <br>
  <h2>Informações da Pesagem</h2>
  <table class="table-striped">
  <thead>
    <tr>
      <th>Proj GMD</th>
      <th>Desvio Padrão</th>
      <th>Numero de Animais</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td id="proj-gmd"></td>
      <td id="desvio"></td>
      <td id="animals-amount"></td>
    </tr>
  </tbody>
  </table>
  <br>
  <h2>Informações do Gado</h2>
  <table class="table-striped">
  <thead>
    <tr>
      <th>Comprador</th>
      <th>Quanto comprou</th>
      <th>GMD</th>
      <th>GMD última pesagem</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td id="buyer"></td>
      <td id="price-gado"></td>
      <td id="gmd-amount"></td>
      <td id="gmd-ultima-pesagem"></td>
    </tr>
  </tbody>
</table>
<br>
<button id="calcular">Calcular Métricas</button>
  `

}


function getDesvioPadrao (array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function total_gmd(days, arrive_weight, today_weight) {
  return (parseFloat(today_weight) - parseFloat(arrive_weight)) / days
}

function count_farms_day(today, arrive) {
  var today_parts = today.split('-')
  var arrive_parts = arrive.split('-')

  var today_date = new Date(today_parts[2], today_parts[1] - 1, today_parts[0])
  var arrive_data = new Date(arrive_parts[2], arrive_parts[1] - 1, arrive_parts[0])

  return (today_date - arrive_data) / (1000*3600*24)
}

function getMetricasPesagem() {
  const gado_relative_path = path.join(path.resolve('.', 'db') + `/cadastro.json`)
  const info_pesagem_relative_path = path.join(path.resolve('.', 'db') + `/info_pesagem.json`)
  const pesagem_relative_path = path.join(path.resolve('.', 'db') + `/pesagem.json`)
  const lote_relative_path = path.join(path.resolve('.', 'db') + `/lote.json`)

  let lote_db = fs.readFileSync(lote_db_relative_path, 'utf8')
  lote_db = JSON.parse(lote_db)

  let pesagem_db = fs.readFileSync(pesagem_relative_path, 'utf8')
  pesagem_db = JSON.parse(pesagem_db)

  let info_pesagem_db = fs.readFileSync(info_pesagem_relative_path, 'utf8')
  info_pesagem_db = JSON.parse(info_pesagem_db)

  let gado_db = fs.readFileSync(gado_relative_path, 'utf8')
  gado_db = JSON.parse(gado_db)

  const gado_id = document.getElementById('Gado_ID')
  const info_pesagem_id = document.getElementById('Numero_Pesagem')
  // gamb
  const kg = document.getElementById('Kg')
  // gamb
  const ultima_pesagem = parseInt(info_pesagem_id.value) - 1
  var sum_gmd = 0
  var array_gmd = []

  var gado_info = gado_db["data"].filter(function (entry) {
    return entry.ID == gado_id.value
  });

  var info_pesagem_info = info_pesagem_db["data"].filter(function (entry) {
    return entry.Numero_Pesagem == info_pesagem_id.value
  });

  var pesagem_info = pesagem_db["data"].filter(function (entry) {
    return entry.Gado_ID == gado_id.value && entry.Numero_Pesagem == ultima_pesagem
  });

  var lote_info = lote_db["data"].filter(function (entry) {
    return entry.Lote == gado_info[0]["Lote"]
  });

  const animais_pesagem = pesagem_db["data"].filter(function (entry) {
    return entry.Numero_Pesagem == info_pesagem_id.value && entry.Check == "OK"
  });

  var td_proj_gmd = document.getElementById('proj-gmd')
  var td_desvio = document.getElementById('desvio')
  var td_qtd_animais = document.getElementById('animals-amount')
  var td_comprador = document.getElementById('buyer')
  var td_gmd = document.getElementById('gmd-amount')
  var td_gmd_ult_pesagem = document.getElementById('gmd-ultima-pesagem')

  // Num Animais
  try {
    num_animais = animais_pesagem.length
    td_qtd_animais.innerHTML = num_animais
  } catch (e) {
    console.log("=== NUMERO ANIMAIS ===")
    console.log(e)
    console.log("=== NUMERO ANIMAIS ===")
    num_animais = "Erro ao calcular o numero de animais"
    td_qtd_animais.innerHTML = num_animais
  }

  // Comprador
  try {
    const comprador = lote_info[0]["Comprador"]
    td_comprador.innerHTML = comprador
  } catch (e) {
    console.log("=== COMPRADOR ===")
    console.log(e)
    console.log("=== COMPRADOR ===")
    const comprador = "Não foi possível achar o comprador"
    td_comprador.innerHTML = comprador
  } 
  
  // GMD 
  try {
    const data_da_pesagem = info_pesagem_info[0]["Data_da_Pesagem"]
    const data_de_chegada = gado_info[0]["Data_de_Chegada"]
    const peso_inicial = gado_info[0]["Peso_@"]
    //let peso_atual = document.getElementById('Peso_@')
    const peso_atual = kg.value / 30
    const total_dias_gado = count_farms_day(data_da_pesagem, data_de_chegada)
    const gmd = total_gmd(total_dias_gado, peso_inicial, peso_atual)
    td_gmd.innerHTML = gmd


    // GAAAMB
    var gmd_input = document.getElementById('GMD')
    gmd_input.value = gmd
    // GAAAMB
  } catch (e) {
    console.log("=== GMD ===")
    console.log(e)
    console.log("=== GMD ===")
    const gmd = "Erro no calculo"
    td_gmd.innerHTML = gmd
  }
    
  // GMD ult Pesagem
  try {
    if (animais_pesagem.length > 0) {
      gmd_ult_pesagem = pesagem_info[0]["GMD"]
    } else {
      gmd_ult_pesagem = "primeira pesagem"
    }
    td_gmd_ult_pesagem.innerHTML = gmd_ult_pesagem
  } catch (e) {
   console.log("=== GMD ult Pes ===")
   console.log(e)
   console.log("=== GMD ult Pes ===")
   const gmd_ult_pesagem = "Primeira Pesagem"
   td_gmd_ult_pesagem.innerHTML = gmd_ult_pesagem
  }

  // Proj GMD
  try {
    animais_pesagem.forEach(function(item) {
      Object.keys(item).forEach(function (key) { 
        if (key == "GMD") {
          sum_gmd += parseFloat(item[key])
          array_gmd.push(item[key])
        }
        })
    })
    console.log(sum_gmd)
    console.log(num_animais)
    const proj_gmd = sum_gmd / num_animais
    td_proj_gmd.innerHTML = proj_gmd
  } catch (e) {
    console.log("=== PROJ GMD ===")
    console.log(e)
    console.log("=== PROJ GMD ===")
    td_proj_gmd.innerHTML = "Primeira Pesagem"
  } 
  
  // Desvio Padrao
  try {
    const desvio_padrao = getDesvioPadrao(array_gmd)
    td_desvio.innerHTML = desvio_padrao
  } catch (e) {
    console.log("=== DESVIO PADRÃO ===")
    console.log(e)
    console.log("=== DESVIO PADRÃO ===")
    const desvio_padrao = 0
    td_desvio.innerHTML = desvio_padrao
  } 
}

