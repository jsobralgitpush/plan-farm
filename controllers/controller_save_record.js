var fs = require('fs')

document.addEventListener('click', function (e) {
  if (e.target && e.target.id == 'save_record') {
    table = e.target.className
    database_absolute_path = path.join(path.resolve('.', 'db') + `/${table.toLowerCase()}.json`)
    database = require(database_absolute_path);

    table_trigg = document.getElementById(table.toLowerCase())
    

    to_insert = {}

    inputs = document.getElementsByClassName('input')

    for (let item of inputs) {
      to_insert[item.id] = item.value
    }

    to_insert["db_ID"] = database["next"]

    console.log(database_absolute_path)

    fs.readFile(database_absolute_path, "utf8", function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        obj = JSON.parse(data); //now it an object
        obj["next"] = obj["next"] + 1
        obj["data"].push(to_insert); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(database_absolute_path, json, "utf8", function (err, result) {
          if (err) {
            console.log(err);
          } else {
            alert("Dados Salvos com Sucesso");
            table_trigg.click()
            add_register_trigg = document.getElementById('add_register')
            add_register_trigg.click()
          }
        });
      }
    });
  }

});

function handle_pesagem() {
  console.log(gmd)
}