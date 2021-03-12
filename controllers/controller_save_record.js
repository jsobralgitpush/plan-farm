var fs = require("fs");
database_absolute_path = __dirname.replace('/views', '/assets/database/db.json')

document.addEventListener('click',function(e){
  if(e.target && e.target.id== 'save_record'){
    table = e.target.className
    to_insert = {}

    inputs = document.getElementsByClassName('input')

    for (let item of inputs) {
      to_insert[item.id] = item.value
    }

    fs.readFile(database_absolute_path, "utf8", function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        obj = JSON.parse(data); //now it an object
        obj[table].push(to_insert); //add some data
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