var fs = require("fs");
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

      // e-2) Adicionando inputs para cada coluna presente
      $.each(columns, function (i, obj) {
        column_infos = database[name]["schema"][obj]
        comment = `${column_infos["comment"]}`;
        value_to = pre_value(`${column_infos["defaultValue"]}`);
        input_type = `${column_infos["inputType"]}`;
        input_to_place = ""

        if (input_type == "number") {
          input_to_place = `<input placeholder="${obj}" class='input-${name}' type="${column_infos["inputType"]}" id="${obj}" value=${column_infos["defaultValue"]}>`
        } else if (input_type == "select") {
          table_to_pick = column_infos["select"]
          var options_to_place = Object.values(database[table_to_pick]["data"]);
          input_to_place = `<select class='input-${name}' id="${obj}">`

          $.each(options_to_place, function (i, obj) {
            input_to_place += `<option value=${obj["ID"]}>${obj["identificador"]}</option>`
          })

          input_to_place += "</select>"
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
    });
  });
});


function dateValidator(date) {
  return date < 10 ? "0" + date : date;
}
function pre_value(field) {
  if (field == "today") {
    const date = new Date();
    const today = `${date.getFullYear()}-${dateValidator(
      date.getMonth() + 1
    )}-${dateValidator(date.getDate())}`;
    return today;
  } else {
    return "";
  }
}

function mask_field(object_schema, value) {
  if (object_schema["dataType"] == "range") {
    
    if (value > parseInt(object_schema["maxRange"])) {
      return {
        result: 1,
        message: `O valor precisa estar entre ${object_schema["minRange"]}-${object_schema["maxRange"]}`,
      };
    }

  } else {

    return {
      result: 0
    }

  }
}

