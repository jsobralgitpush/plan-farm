window.addEventListener('load', function() {
  // Table head para adicionarmos colunas, botões e título
  var table_head = document.getElementsByClassName("table-head")[0]
  var table_title = document.getElementsByClassName("buttons-show")[0]
  var table_body = document.getElementsByClassName('table-body')[0]

  // Input Place
  var input_place = document.getElementsByClassName('action')[0]
  var action_helper = document.getElementsByClassName('action-helper')[0]


  // Possíveis Tabelas
  var lote = document.getElementById('lote')
  var cadastro = document.getElementById('cadastro')
  var info_pesagem = document.getElementById('info_pesagem')
  var pesagem = document.getElementById('pesagem')
  var financeiro = document.getElementById('financeiro')
  var chuva = document.getElementById('chuva')
  var sal = document.getElementById('sal')

  // Sales
  var vendas = document.getElementById('sales')

  var array_tables = [lote, cadastro, info_pesagem, pesagem, financeiro, chuva, sal, vendas]

  // Adicionar nome e botões de interação nas tabelas
  array_tables.forEach(function(item) {
    item.addEventListener('click', function() {
      // Zerando informações
      table_body.innerHTML = ""
      input_place.innerHTML = ""
      action_helper.innerHTML = ""

      set_table(table_title, item.textContent)
      set_table_columns(table_head, item.textContent.trim())
    })
  })

})


function set_table(html, name) {
  html.innerHTML = `
    <div class="table-header">
    <div class="title">${name}</div>
    <div class="container-buttons">
      <a class="add-register" id="add_register" data-table=${name}>Adicionar Registro</a>
      <a class="add-column" id="show_register" data-table=${name}>Mostrar Registros</a>
    </div> 
    </div>
`
}

// Refactor
function set_table_columns(html, table) {
  html.innerHTML = ""

  lote_columns = ["Lote", "Data_de_Chegada", "Frete", "Comissão", "Valor_Animais", "Comprador", "Numero_de_Animais"]
  cadastro_columns = ["ID", "Data_de_Chegada", "Peso_de_Chegada_em_Kg", "Peso_@", "Lote", "Tamanho"]
  info_pesagem_columns = ["Numero_Pesagem", "Data_da_Pesagem", "U_inf", "U_sup", "P_inf", "P_sup", "M_inf", "M_sup", "G_inf", "G_sup"]
  pesagem_columns = ["Numero_Pesagem", "Gado_ID", "Lote", "Check", "Kg", "Peso @", "Tamanho", "GMD"]
  financeiro_columns = ["Data", "Valor", "Classificação", "Subclassificação", "Comentário"]
  chuva_columns = []
  sal_columns = []

  if (table == "Lote") {
    lote_columns.forEach(function(item) {
      html.innerHTML += `<th>${item}</th>`
    })
  } else if (table == "Cadastro") {
    cadastro_columns.forEach(function(item) {
      html.innerHTML += `<th>${item}</th>`
    })
  } else if (table == "Info_Pesagem") {
    info_pesagem_columns.forEach(function(item) {
      html.innerHTML += `<th>${item}</th>`
    })
  } else if (table == "Pesagem") {
    pesagem_columns.forEach(function(item) {
      html.innerHTML += `<th>${item}</th>`
    })
  } else if (table == "Financeiro") {
    financeiro_columns.forEach(function(item) {
      html.innerHTML += `<th>${item}</th>`
    })
  } else if (table == "Chuva") {
    chuva_columns.forEach(function(item) {
      html.innerHTML += `<th>${item}</th>`
    })
  } else if (table == "Sal") {
    sal_columns.forEach(function(item) {
      html.innerHTML += `<th>${item}</th>`
    })
  }


}