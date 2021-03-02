var fs = require("fs");
const { data } = require("jquery");
database = require("../db.json");

$(document).ready(function () {

  // Habilitando Menus
  $.each(database, function (i, obj) {
    $(".collections-div").append(
      `
      <p class="nav-group-item collection">
        ${i}
      </p>
      `
    );
  });

  // 1-Alterar o layout quando o usuário clica em uma tabela genérica
  $(".collection").on("click", function () {
    // a) Definindo os objetos básicos de cada tabela
    var name = $(this).text().trim();
    var columns = Object.keys(database[name]["schema"]);
    var values = Object.values(database[name]["data"]);
    var to_insert = {};

    // b) Limpando a seleção anterior
    $(".table-head").empty();
    $(".table-body").empty();
    $(".buttons-show").empty();

    // c) Adicionando Butões e Título ao registro
    $(".buttons-show").append(
      `
      <div class="table-header">
        <div class="title">${name}</div>
        <div class="container-buttons">
          <a class="add-register" id=${name} href="#register" rel="modal:open">Adicionar Registro</a>
          <a class="add-column" id=${name} href="#column" rel="modal:open">Adicionar Coluna</a>
        </div>
      </div>
      `
    );

    // d) Para cada coluna, criar um table header
    $.each(columns, function (i, obj) {
      $(".table-head").append(
        `
          <th>${obj}</th>
        `
      );

      to_insert[obj] = "";
    });

    // d) Para cada linha presente, criar um table row
    $.each(values, function (i, obj) {
      td_to_insert = "";

      $.each(obj, function (j, object) {
        td_to_insert += `<td>${object}</td>`;
      });

      $(".table-body").append(
        `
        <tr>
        ${td_to_insert}
        </tr>
        `
      );
    });

    // e) Modal de criação de registros
    $(".add-register").on("click", function () {
      // e-1) Limpando informações anteriores
      $("#register").empty();
      $("#register").append(`
        <h3>Novo registro</h3>
      `);

      // Case tabela Pesagem
      if (name == "Pesagem") {

        // Lidando com o input "Rebanho"
        table_to_pick = "Lote"
        var options_to_place = Object.values(database[table_to_pick]["data"]);
        input_to_place = `<select class='input-${name} id-lote' id=${table_to_pick}><option disabled selected value> -- selecione uma opção -- </option>`

        $.each(options_to_place, function (i, obj) {
          input_to_place += `<option value=${obj["ID"]}>${obj["ID"]}</option>`
        })

        input_to_place += '</select>'

        // input id da pesagem e do gado
        $("#register").append(
          `
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Lote</label>
            ${input_to_place}
          </div> 
          <div class="modal-input">
              <span class="color-tip color"></span>
              <label>Gado</label>
              <input class='input-${name} id-gado' id="Gado" disabled>
          </div>
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Check</label>
            <input class='input-${name} check-gado' id="Check" disabled>
          </div>
            <ul id="pesagem-gado-info">
            </ul>
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Kg</label>
            <input class='input-${name} kg-gado' id="Kg">
          </div>
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Peso @</label>
            <input class='input-${name} peso-arroba' id="Peso @" disabled>
          </div>
          `
        )

        // Peso @ = Peso kg / 30
        $('.kg-gado').on('change, keyup', function() {
          $('.peso-arroba').val($(this).val()/30)
        })

        // Enquanto o ID do Lote não tiver sido selecionado, desabilitador o ID do gado
        $('.id-lote').on("change", function() {
          gado = $('.id-gado')
          $('.check-gado').val("")

          if ($(this).val() != "") {
            gado.prop("disabled", false)
          }

        })

        $('.id-gado, .id-lote').on("change, keyup", function() {
          // Procurar por este gado no cadastro
          gado_id = $('.id-gado').val()


          // Analisar se o campo gado já foi preenchido
          if (gado_id == "") {
            $('.check-gado').val("")
            return
          }

          // 1-Gado não existe
          var match = $.grep(database["Cadastro"]["data"], function(i, n) {
            return i.ID == gado_id;
          })

          if(jQuery.isEmptyObject(match)) {
            $('.check-gado').val('N/A')
          }


          // 2-Gado existe
          // 2a) Já foi computado
          pesagem_id = $('.id-lote').val()
          match_gado = $.grep(database["Pesagem"]["data"], function(i, n) {
            return (i.Lote == pesagem_id && i.Gado == gado_id);
          })

          if(jQuery.isEmptyObject(match_gado)) {
          } else {
            $('.check-gado').val('REP')
          }

          // 2b) Ainda não foi computado
          if ($('.check-gado').val() == "") {
            $('.check-gado').val('OK')
          }


        })

        // 3b) Fluxo de controle de Pesagem
        $('.id-gado').on("change, keyup", function() {
          gado_id = $(this).val()
          $("#pesagem-gado-info").empty()
  
          match_gado = $.grep(database["Cadastro"]["data"], function(i, n) {
            return (i.ID == gado_id);
          })

          if(jQuery.isEmptyObject(match_gado)) {
            // 3a) Gado não existe - NADA É FEITO
          } else {
            // 3b) Gado existe

            rebanho_id = match_gado[0]["Rebanho"]

            match_rebanho = $.grep(database["Rebanho"]["data"], function(i, n) {
              return (i.ID == rebanho_id);
            });

            custo_frete = parseInt(match_rebanho[0]["Frete"])
            custo_rebanho = parseInt(match_rebanho[0]["Valor Animais"])
            custo_comissao = parseInt(match_rebanho[0]["Comissão"])
            qtd_animais = parseInt(match_rebanho[0]["Número de Animais"])
            preco_unidade = (custo_frete + custo_comissao + custo_rebanho) / qtd_animais

            $("#pesagem-gado-info").append(
              `
              <div class="modal-input">
                <p><strong> Data de Chegada:</strong> ${match_gado[0]["Data de chegada"]} </p>
              </div>
              <div class="modal-input">  
                <p><strong> Comprador:</strong> ${match_rebanho[0]["Comprador"]} </p>
              </div>
              <div class="modal-input">  
                <p><strong> Peso de Chegada em @:</strong> ${match_gado[0]["Peso @"]} </p>
              </div>
              <div class="modal-input">  
                <p><strong> Preço unidade:</strong> ${preco_unidade} </p>
              </div>
              `
            );


          }

        })


      // Case tabela Financeiro
      } else if (name == "Financeiro") {

        $("#register").append(
          `
          <div class="modal-input">
              <span class="color-tip color"></span>
              <label>Data</label>
              <input class='input-${name}' id="Data" value=${pre_value("today")}>
          </div>
          <div class="modal-input">
              <span class="color-tip color"></span>
              <label>Valor</label>
              <input class='input-${name} id-gado' id="Valor" type="number">
          </div>
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Classificação</label>
            <select class="input-${name}" id="Classificação">
              <option disabled selected value> -- selecione uma opção -- </option>
              <option value="ADM" >ADM</option>
              <option value="Manutenção e Equipamento" >Manutenção e Equipamento</option>
              <option value="Manutenção do Pasto" >Manutenção do Pasto</option>
              <option value="Mão de Obra" >Mão de Obra</option>
              <option value="Sal" >Sal</option>
              <option value="Vacina" >Vacina</option>
            </select> 
          </div>
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Subclassificação</label>
            <select class='input-${name}' id="Subclassificação" disabled>
            </select>
          </div>
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Comentário</label>
            <input class='input-${name} kg-gado' id="Comentário">
          </div>
          `
        )

        $('#Classificação').on('change', function() {
          option = $(this).val()

          $('#Subclassificação').prop("disabled", false)

          if (option == "ADM") {

            $('#Subclassificação').empty()

            $('#Subclassificação').append($('<option>', {
              value: 'Viagem',
              text: 'Viagem'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Estadia',
              text: 'Estadia'
            }));

          } else if (option == "Manutenção e Equipamento") {

            $('#Subclassificação').empty()
            
            $('#Subclassificação').append($('<option>', {
              value: 'Trator 01',
              text: 'Trator 01'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Trator 02',
              text: 'Trator 02'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Roçadeira 01',
              text: 'Roçadeira 01'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Roçadeira 02',
              text: 'Roçadeira 02'
            }));


            $('#Subclassificação').append($('<option>', {
              value: 'Pulverizador 01',
              text: 'Pulverizador 01'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Pulverizador 02',
              text: 'Pulverizador 02'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Grade',
              text: 'Grade'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Pipa',
              text: 'Pipa'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Carreta',
              text: 'Carreta'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Caminhonete',
              text: 'Caminhonete'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'Moto',
              text: 'Moto'
            }));


          } else if (option == "Manutenção do Pasto") {

            $('#Subclassificação').empty()

          } else if (option == "Mão de Obra") {

            $('#Subclassificação').empty()


            $('#Subclassificação').append($('<option>', {
              value: 'Salário',
              text: 'Salário'
            }));

            $('#Subclassificação').append($('<option>', {
              value: 'e-social',
              text: 'e-social'
            }));

          } else if (option == "Sal") {

            $('#Subclassificação').empty()

          } else if (option == "Vacina") {

            $('#Subclassificação').empty()

          }

        })



      
      } else if (name == "Cadastro") {

        // Lidando com o input "Rebanho"
        table_to_pick = "Rebanho"
        var options_to_place = Object.values(database[table_to_pick]["data"]);
        input_to_place = `<select class='input-${name}' id=${table_to_pick}>`

        $.each(options_to_place, function (i, obj) {
          input_to_place += `<option value=${obj["ID"]}>${obj["ID"]}</option>`
        })

        input_to_place += '</select>'

        $("#register").append(
          `
          <div class="modal-input">
              <span class="color-tip color"></span>
              <label>ID</label>
              <input class='input-${name}' id="ID" type="number">
          </div>
          <div class="modal-input">
              <span class="color-tip color"></span>
              <label>Data de Chegada</label>
              <input class='input-${name}' id="Data de chegada" value=${pre_value("today")}>
          </div>
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Peso de Chegada em kg</label>
            <input class='input-${name} peso-kg' id="Peso de chegada em Kg">
          </div>
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Peso @</label>
            <input class='input-${name} peso-arroba' id="Peso @" disabled>
          </div>
          <div class="modal-input">
            <span class="color-tip color"></span>
            <label>Rebanho</label>
            ${input_to_place}
          </div> 
          `
        )

        // Peso @ = Peso kg / 30
        $('.peso-kg').on('change, keyup', function() {
          $('.peso-arroba').val($(this).val()/30)
        })


      

      // Case tabela Genérica
      } else {
        // e-2) Adicionando inputs para cada coluna presente
        $.each(columns, function (i, obj) {
          column_infos = database[name]["schema"][obj]
          comment = `${column_infos["comment"]}`;
          value_to = pre_value(`${column_infos["defaultValue"]}`, database[name]["data"]);
          input_type = `${column_infos["inputType"]}`;
          input_to_place = ""

          if (input_type == "number") {
            input_to_place = `<input placeholder="${obj}" class='input-${name}' type="${column_infos["inputType"]}" id="${obj}" value=${column_infos["defaultValue"]}>`
          } else if (input_type == "select") {
            table_to_pick = column_infos["select"]
            var options_to_place = Object.values(database[table_to_pick]["data"]);
            input_to_place = `<select class='input-${name}' id="${obj}">`

            $.each(options_to_place, function (i, obj) {
              input_to_place += `<option value=${obj["ID"]}>${obj["ID"]}</option>`
            })

            input_to_place += "</select>"
          } else if (input_type == "fixed") {
            input_to_place = `<input placeholder="${obj}" class='input-${name}' type="${column_infos["inputType"]}" id="${obj}" value=${value_to} disabled>`
          } else if (input_type == "date") {
            input_to_place = `<input placeholder="${obj}" class='input-${name}' id="${obj}" value=${value_to}>`
          } else {
            input_to_place = `<input placeholder="${obj}" class='input-${name}' id="${obj}" value=${value_to}>`
          }

          $("#register").append(
            `
            <div class="modal-input">
                <span class="color-tip color-${i}"></span>
                <label>${obj}</label>
                ${input_to_place}
                <span class="icon icon-help-circled help" title="${comment}"></span>
            </div>
            `
          );
        });

      }

      

      // e-3) Verificando máscara de campo
      $("input").on("change", function () {
        input = mask_field(
          database[name]["schema"][$(this).attr("id")],
          database[name]["data"],
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
    });
  });
});


function dateValidator(date) {
  return date < 10 ? "0" + date : date;
}
function pre_value(field, data, options) {
  if (field == "today") {
    const date = new Date();
    const today = `${dateValidator(date.getDate())}-${dateValidator(date.getMonth() + 1)}-${date.getFullYear()}`;
    return today;
  } else if (field == "auto_increment") {
    var to_increment = []
    for (i in data) {
      to_increment.push(parseInt(data[i]["ID"]))
    }

    return to_increment.sort().slice(-1)[0] + 1 || 1
  } else if (field == "kg_to_@+") {

  } else {
    return "";
  }
}

function mask_field(object_schema, object_data, value) {
  if (object_schema["dataType"] == "range") {
    
    if (value > parseInt(object_schema["maxRange"])) {
      return {
        result: 1,
        message: `O valor precisa estar entre ${object_schema["minRange"]}-${object_schema["maxRange"]}`,
      };
    }

  }  else {

    return {
      result: 0
    }

  }
}

