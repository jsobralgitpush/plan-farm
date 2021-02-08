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
        // input id da pesagem e do gado
        $("#register").append(
          `
          <div class="modal-input">
              <span class="color-tip color"></span>
              <label>ID</label>
              <input class='input-${name} id-pesagem' id="ID" type="number">
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
          `
        )

      
        // Enquanto o ID da pesagem não tiver sido selecionado, desabilitador o ID do gado
        $('.id-pesagem').on("change", function() {
          gado = $('.id-gado')
          $('.check-gado').val("")

          if ($(this).val() != "") {
            gado.prop("disabled", false)
          }

          $('.id-gado, .id-pesagem').on("change", function() {
            // Procurar por este gado no cadastro
            gado_id = $(this).val()
  
            // 1-Gado não existe
            var match = $.grep(database["Cadastro"]["data"], function(i, n) {
              return i.ID == gado_id;
            })
  
            if(jQuery.isEmptyObject(match)) {
              $('.check-gado').val('N/A')
            }
  
  
            // 2-Gado existe
            // 2a) Já foi computado
            pesagem_id = $('.id-pesagem').val()
            match_gado = $.grep(database["Pesagem"]["data"], function(i, n) {
              return (i.ID == pesagem_id && i.Gado == gado_id);
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


  
        })

      // Case tabela Financeiro
      } else if (name == "Financeiro") {


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
function pre_value(field, data) {
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

