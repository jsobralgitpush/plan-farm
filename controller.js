const { data } = require('jquery');
var fs = require('fs');
database = require('./db.json')

$(document).ready(function() {
  console.log('não acredito')


  $('.metric-peso, .metric-gmd').on('click', function() {
    $('.metric').css('display', 'block')
    $('.records').css('display', 'none')
  })

  // Chamando um número de menus iguais ao de tabela
  $.each(database, function(i, obj) {
    $('.collections-div').append(
      `
      <p class="nav-group-item collection">
        ${i}
      </p>
      `
    )
  });



  // Alterar o layout da direita quando o usuário clicar 
  $('.collection').on('click', function() {
    $('.metric').css('display', 'none')
    $('.records').css('display', 'block')

    var name = $(this).text().trim()
    var columns = Object.keys(database[name]["schema"])
    var values = Object.values(database[name]["data"])
    const to_insert = {}

    $('.table-head').empty()
    $('.table-body').empty()
    $('.buttons-show').empty()

    $('.buttons-show').append(
      `
      <a class="add-register" id=${name} href="#register" rel="modal:open">Adicionar Registro</a>
      <br>
      <a class="add-column" id=${name} href="#column" rel="modal:open">Adicionar Coluna</a>
      `
    )

    $.each(columns, function(i, obj) {
      $('.table-head').append(
        `
          <th>${obj}</th>
        `
      )

      to_insert[obj] = ""
    })

    $.each(values, function(i, obj) {
      td_to_insert = ""

      $.each(obj, function(j, object) {
        td_to_insert += `<td>${object}</td>`
      })

      $('.table-body').append(
        `
        <tr>
        ${td_to_insert}
        </tr>
        `
      )
    })

    $(".add-register").on('click', function() {
      $('#register').empty()

      $.each(columns, function(i, obj) {
        comment = `${database[name]["schema"][obj]["comment"]}`
        value_to = pre_value(`${database[name]["schema"][obj]["dataType"]}`)

        $('#register').append(
          `
          <label>${obj}</label>
          <input class='input-${name}' type="text" id="${obj}" value=${value_to}>
          <span class="icon icon-help-circled help" title="${comment}"></span>
          <br>
          `
        )
      })

      $('input').on('change', function() {
        input = mask_field(database[name]["schema"][$(this).attr('id')], $(this).val())

        if (input["result"] == 1) {
          $(this).val("") 
          alert(input["message"])
        }
      })

      $('.help').on('mouseover', function(event) {
        $(document).tooltip();
      })

      $('#register').append(`<button class='create' id=${name}>Criar</button>`)


      $(".create").on('click', function() {
        // 1- Checar se todos os campos estão preenchidos

        // 2 - Popular hash "to_insert"
        $(`.input-${name}`).each(function(i, obj) {
          to_insert[$(obj).attr('id')] = $(obj).val()
        })

        // 3 - gravar os objeto dentro do arquivo db.json
        fs.readFile('db.json', 'utf8', function readFileCallback(err, data){
          if (err){
              console.log(err);
          } else {
            obj = JSON.parse(data); //now it an object
            obj[name]["data"].push(to_insert); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('db.json', json, 'utf8', function(err, result) {
              if (err) {
                console.log(err)
              } else {
                
                alert('Dados Salvos com Sucesso')
              }
            }); 
        }});

      })

    })


  })



});




function pre_value(field) {
  if (field == "today") {
    return new Date().toLocaleDateString()
  } else {
    return ""
  }
}

function mask_field(object_schema, value) {
  if (object_schema["dataType"] == "range") {
    if (value > parseInt(object_schema["maxRange"])) {
      return {"result": 1, "message": `O valor precisa estar entre ${object_schema["minRange"]}-${object_schema["maxRange"]}`}
    }
  }
}