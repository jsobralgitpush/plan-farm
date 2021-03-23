lote_columns = ["Lote","Data de Chegada","Frete", "Comissão", "Valor Animais", "Comprador","Número de Animais"]
cadastro_columns = ["ID", "Data de Chegada", "Peso de Chegada em Kg", "Peso @", "Lote", "Tamanho"]
info_pesagem_columns = ["Número_Pesagem", "Data da Pesagem", "U inf", "U sup", "P inf", "P sup", "M inf", "M sup", "G inf", "G sup"]
pesagem_columns = ["Número_Pesagem", "Gado ID", "Lote", "Check", "Kg", "Peso @", "Tamanho"]
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
    input_place.innerHTML = ""

    table = e.target.getAttribute("data-table")

    columns_array.forEach(function(item) {
      if (item[0] == table) {
        input_place.innerHTML = `<h1>Novo Registro de ${item[0]}</h1>`
        item[1].forEach(function(sub_item) {
          input_place.innerHTML += `
          <div class="modal-input">
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

      num_pesagem = document.getElementById('Número_Pesagem')
      gado_id = document.getElementById('Gado ID')
      kg = document.getElementById('Kg')

      num_pesagem.addEventListener('change', function(e) {
        handle_num_pesagem(e)
      })

      gado_id.addEventListener('change', function(e) {
        handle_gado_id(e)        
      })

      kg.addEventListener('change', function(e) {
        handle_kg(e)        
      })
    }


   }
});


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
      <th>Número de Animais</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="proj-gmd"></td>
      <td class="error"></td>
      <td class="animals-amount"></td>
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
      <td class="buyer"></td>
      <td class="price-gado"></td>
      <td class="gmd"></td>
      <td class="gmd-ultima-pesagem"></td>
    </tr>
  </tbody>
</table>
  `

}

function handle_gado_id(event) {
  gado_relative_path = `../assets/database/cadastro.json`
  lote_relative_path = `../assets/database/lote.json`

  let gado_db = require(gado_relative_path);
  let lote_db = require(lote_relative_path);

  gado_info = gado_db["data"].filter(function (entry) {
    return entry.ID == event.target.value
  });

  lote_info = lote_db["data"].filter(function (entry) {
    return entry.Lote == gado_info[0]["Lote"]
  });

  let buyer = document.getElementsByClassName('buyer')[0]
  return buyer.innerHTML = lote_info[0]["Comprador"]
}

function handle_kg(event) {
  let pesagem_relative_path = `../assets/database/pesagem.json`
  let gado_relative_path = `../assets/database/cadastro.json`

  let gado_db = require(gado_relative_path);
  let pesagem_db = require(pesagem_relative_path);

  let pesagem_info = pesagem_db["data"].filter(function (entry) {
    return entry.Número_Pesagem == event.target.value
  });

  gado_id = document.getElementById('Gado ID')
  let gado_info = gado_db["data"].filter(function (entry) {
    return entry.Número_Pesagem == gado_id.value
  });

  // GMD

}

function handle_num_pesagem(event) {
  let pesagem_relative_path = `../assets/database/pesagem.json`

  let pesagem_db = require(pesagem_relative_path);

  let pesagem_info = pesagem_db["data"].filter(function (entry) {
    return entry.Número_Pesagem == event.target.value && entry.Check == "OK"
  });

  // Quantidade de Animais
  let animals = document.getElementsByClassName('animals-amount')[0]
  return animals.innerHTML = pesagem_info.length

  // Gmd Proj


  // Desvio Padrão


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

//dias_na_fazenda = count_farms_day(match_rebanho[0]["Data do Rebanho"], match_gado[0]["Data de chegada"])
//gmd_total = total_gmd(dias_na_fazenda, match_gado[0]["Peso @"], $('.peso-arroba').val())