var fs = require('fs')

document.addEventListener('click', function (e) {
  if (e.target && e.target.id == 'save_record') {
    table = e.target.className
    database_absolute_path = path.join(path.resolve('.', 'db') + `/${table.toLowerCase()}.json`)

    to_insert = {}

    inputs = document.getElementsByClassName('input')

    for (let item of inputs) {
      to_insert[item.id] = item.value
    }

    let database = fs.readFileSync(database_absolute_path, 'utf8')
    database = JSON.parse(database)

    to_insert["db_ID"] = database["next"]

    database["next"] = database["next"] + 1
    database["data"].push(to_insert)
    database = JSON.stringify(database)

    try {
      fs.writeFileSync(database_absolute_path, database, 'utf8')
      add_register_trigg = document.getElementById('add_register')
      add_register_trigg.click()
      alert('Dados Salvos com sucesso')
    } catch (e) {
      console.log(e)
    }
  }

});

function handle_pesagem() {
  console.log(gmd)
}