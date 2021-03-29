window.addEventListener('load', function() {
  sales = document.getElementById('sales')

  
  sales.addEventListener('click', function() {
    input_place = document.getElementsByClassName('action')[0]

    input_place.innerHTML = `
    <div class="modal-input">
    <span class="color-tip color"></span>
    <label>Data da Venda</label>
    <input class='input' id="2">
    </div>

    <div class="modal-input">
    <span class="color-tip color"></span>
    <label>Numero de Cabeças</label>
    <input class='input' id="2">
    </div>

    <div class="modal-input">
    <span class="color-tip color"></span>
    <label>Média</label>
    <input class='input' id="2">
    </div>

    <div class="modal-input">
    <span class="color-tip color"></span>
    <label>Proj GMD</label>
    <input class='input' id="2">
    </div>



    <button>Calcular</button>
    `

  })
})