database_relative_path = "../assets/database/db.json"

document.addEventListener('click',function(e){
  if(e.target && e.target.id== 'show_register'){
    database = require(database_relative_path);
    table = e.target.getAttribute("data-table")
    values = Object.values(database[table]);
    table_body = document.getElementsByClassName('table-body')

    for (let item of values) {
      td_to_insert = ""

      Object.keys(item).forEach(function (key) { 
        td_to_insert += `<td>${key}</td>`
      })

      table_body[0].insertRow(
        `
        <tr>
          ${td_to_insert}
        </tr>
        `
      )
    }
  }
})