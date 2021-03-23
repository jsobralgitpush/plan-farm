
document.addEventListener('click',function(e){
  if(e.target && e.target.id== 'show_register'){
    table = e.target.getAttribute("data-table")
    database_relative_path = `../assets/database/${table.toLowerCase()}.json`
    database = require(database_relative_path);
    values = Object.values(database["data"]);
    table_body = document.getElementsByClassName('table-body')

    for (let item of values) {
      td_to_insert = ""

      Object.keys(item).forEach(function (key) { 
        if (key == "db_ID" || key == "GMD") return
        td_to_insert += `<td>${item[key]}</td>`
      })

      table_body[0].innerHTML += 
      `
      <tr>
        ${td_to_insert}
      </tr>
      `
    }
  }
})