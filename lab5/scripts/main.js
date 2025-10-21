var passa = document.getElementById("passa");
passa.onmouseover = function(){ passa.innerHTML = "Olá! Passaste por aqui 😄"; }
passa.onmouseout  = function(){ passa.innerHTML = "1. Passa por aqui!"; }

var pinta = document.getElementById("pinta");

document.querySelectorAll("button.color").forEach((botao) => {
  botao.addEventListener("click", () => {
    pinta.style.color = botao.dataset.color;
  });
});

var inputLetra = document.getElementById("input-letra");
var cores = ["lightcoral","lightgreen","lightblue","khaki"];
var indice = 0;
inputLetra.onkeyup = function(){
  inputLetra.style.backgroundColor = cores[indice];
  indice = indice + 1;
  if (indice >= cores.length) { indice = 0; }
}

var select = document.getElementById("select-cor");

select.onchange = function() {
  document.querySelector("body").style.backgroundColor = this.value;
};


var contaBtn = document.getElementById("btn-conta");
var contadorSpan = document.getElementById("contador");
var STORAGE_KEY = "contador";

function atualizarView(valor) {
  contadorSpan.textContent = valor;
}

function carregarContador() {
  var guardado = localStorage.getItem(STORAGE_KEY);
  if (guardado === null) {
    guardado = "0";
    localStorage.setItem(STORAGE_KEY, guardado);
  }
  atualizarView(guardado);
}

function incrementarContador() {
  var valor = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  valor = valor + 1;
  localStorage.setItem(STORAGE_KEY, valor);
  atualizarView(valor);
}

window.addEventListener("DOMContentLoaded", carregarContador);
contaBtn.addEventListener("click", incrementarContador);


document.querySelector("form").onsubmit = function(e) {
  e.preventDefault(); 

  var nome = document.getElementById("nome").value;
  var idade = document.getElementById("idade").value;

  document.getElementById("resultado").textContent =
    "Olá, o " + nome + " tem " + idade + "!";
};

var autoSpan = document.getElementById("auto-counter");
var auto = 0;
setInterval(function(){
  auto = auto + 1;
  autoSpan.innerHTML = auto;
}, 1000);
