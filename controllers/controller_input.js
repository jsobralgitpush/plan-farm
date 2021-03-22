lote_columns = ["Lote","Data de Chegada","Frete", "Comissão", "Valor Animais", "Comprador","Número de Animais"]
cadastro_columns = ["ID", "Data de Chegada", "Peso de Chegada em Kg", "Peso @", "Lote", "Tamanho"]
info_pesagem_columns = ["Número Pesagem", "Data da Pesagem", "U inf", "U sup", "P inf", "P sup", "M inf", "M sup", "G inf", "G sup"]
pesagem_columns = ["Número Pesagem", "Gado ID", "Lote", "Check", "Kg", "Peso @", "Tamanho"]
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

      num_pesagem = document.getElementById('Número Pesagem')
      gado_id = document.getElementById('Gado ID')
      kg = document.getElementById('Kg')

      num_pesagem.addEventListener('keyup', function(e) {
        handle_num_pesagem(e)
      })

      gado_id.addEventListener('keyup', function(e) {
        handle_gado_id(e)        
      })

      kg.addEventListener('keyup', function(e) {
        handle_kg(e)        
      })

    }


   }
});

function dateValidator(date) {
  return date < 10 ? "0" + date : date;
}

function mask_input(input, type, table) {
  if (type == "auto-increment") {
    database_relative_path = `../assets/database/${table.toLowerCase()}.json`
    database = require(database_relative_path);
    // input.value = "a"
  } else if (type == "today") {
    const date = new Date();
    const today = `${dateValidator(date.getDate())}-${dateValidator(date.getMonth() + 1)}-${date.getFullYear()}`;
    input.value = today
  }
}

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
      <td></td>
      <td></td>
      <td></td>
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

  gado_db = require(gado_relative_path);
  lote_db = require(lote_relative_path);

  gado_info = gado_db["data"].filter(function (entry) {
    return entry.ID == event.target.value
  });

  lote_info = lote_db["data"].filter(function (entry) {
    return entry.Lote == gado_info[0]["Lote"]
  });


}

function handle_kg(event) {

}

function handle_num_pesagem(event) {
  database_relative_path = `../assets/database/pesagem.json`
  database = require(database_relative_path);
  
  // Se ja tivermos alguma pesagem, loadar as infos


}