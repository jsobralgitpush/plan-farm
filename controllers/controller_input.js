lote_columns = ["Lote", "Data de Chegada", "Frete", "Comissão", "Valor Animais", "Comprador", "Número de Animais"]
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
    table = e.target.getAttribute("data-table")
    input_place.innerHTML = ""

    columns_array.forEach(function(item) {
      if (item[0] == table) {
        input_place.innerHTML = `<h1>Novo Registro de ${item[0]}</h1>`
        item[1].forEach(function(sub_item) {
          input_place.innerHTML += `
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>${sub_item}</label>
            <input class='input' id="${sub_item}" type="number">
          </div>
          `
        })
      }
    })

    input_place.innerHTML += `<button class=${table} id="save_record">Salvar Dados</button>`

   }
});
