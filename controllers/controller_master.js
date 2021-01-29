(function( $ ){
  $.fn.modal_generic_register = function() {
    console.log('teste')
    // Início da função

    // e-1) Limpando informações anteriores
    $("#register").empty();
    $("#register").append(`
      <h3>Novo registro</h3>
    `);

    // e-2) Adicionando inputs para cada coluna presente
    $.each(columns, function (i, obj) {
      comment = `${database[name]["schema"][obj]["comment"]}`;
      value_to = pre_value(`${database[name]["schema"][obj]["defaultValue"]}`);
      input_type = `${database[name]["schema"][obj]["inputType"]}`;

      $("#register").append(
        `
        <div class="modal-input">
            <span class="color-tip color-${i}"></span>
            <label>${obj}</label>
            <input placeholder="${obj}" class='input-${name}' type="${input_type}" id="${obj}" value=${value_to}>
            <span class="icon icon-help-circled help" title="${comment}"></span>
        </div>
        `
      );
    });

    // e-3) Verificando máscara de campo
    $("input").on("change", function () {
      input = mask_field(
        database[name]["schema"][$(this).attr("id")],
        $(this).val()
      );

      if (input["result"] == 1) {
        $(this).val("");
        alert(input["message"]);
      }
    });


    // e-4) Abrindo ajuda de campos
    $(".help").on("mouseover", function (event) {
      $(document).tooltip();
    });

    // e-5) Criando os botões de registro
    $("#register").append(`
    <div class="container-buttons between">
      <button class='create' id=${name}>Criar</button>
      <button class='create-and-new' id=${name}>Criar e adicionar mais um</button>
    </div>
    `);

    // e-6) Para salvarmos um registro
    $(".create").on("click", function () {
      // e-6-1) Checar se todos os campos estão preenchidos
      $('input').each(function(i, obj) {
        if ($(this).val() == "") {
          alert('não pode colocar dado em branco')
          return false
        }
      })

      // e-6-2) Popular hash "to_insert"
      $(`.input-${name}`).each(function (i, obj) {
        to_insert[$(obj).attr("id")] = $(obj).val();
      });

      // e-6-3) gravar os objeto dentro do arquivo db.json
      fs.readFile("db.json", "utf8", function readFileCallback(err, data) {
        if (err) {
          console.log(err);
        } else {
          obj = JSON.parse(data); //now it an object
          obj[name]["data"].push(to_insert); //add some data
          json = JSON.stringify(obj); //convert it back to json
          fs.writeFile("db.json", json, "utf8", function (err, result) {
            if (err) {
              console.log(err);
            } else {
              alert("Dados Salvos com Sucesso");
            }
          });
        }
      });
    });

    // Fim da função
  }; 
})( jQuery );