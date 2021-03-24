var fs = require("fs");

document.addEventListener('click', function (e) {
  if (e.target && e.target.id == 'save_record') {
    table = e.target.className
    database_absolute_path = __dirname.replace('/views', `/assets/database/${table.toLowerCase()}.json`)
    database_relative_path = `../assets/database/${table.toLowerCase()}.json`
    database = require(database_relative_path);


    to_insert = {}

    inputs = document.getElementsByClassName('input')

    for (let item of inputs) {
      to_insert[item.id] = item.value
    }

    to_insert["db_ID"] = database["next"]

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
          }
        });
      }
    });
  }

});

function handle_pesagem() {
  console.log(gmd)
}