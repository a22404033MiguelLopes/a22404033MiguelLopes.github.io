let movimentos = 0;

function entra() {
  const textoZona = document.getElementById('txt1');
  textoZona.textContent = 'Olá! 👋';
}

function sai() {
  const textoZona = document.getElementById('txt1');
  const coordenadas = document.getElementById('coords');
  textoZona.textContent = 'Entra com o rato…';
  coordenadas.textContent = '';
  movimentos = 0;
}

function move() {
  movimentos++;
  const coordenadas = document.getElementById('coords');
  coordenadas.textContent = 'movimentos: ' + movimentos;
}

function pintaCor(cor) {
  const alvo = document.getElementById('alvo');
  alvo.style.color = cor ;
}

function pintaRed()   { pintaCor('red'); }
function pintaGreen() { pintaCor('green'); }
function pintaBlue()  { pintaCor('blue'); }
function pintaReset() { pintaCor(''); }

function mudaInput() {
  const teclado = document.getElementById('teclado');
  const paleta = ['#ffd', '#dfd', '#def', '#fdd', '#cdf', '#fec'];
  teclado.style.backgroundColor = paleta[teclado.value.length % paleta.length];
}

function mudaPagina() {
  const campoCor = document.getElementById('cor');
  document.body.style.backgroundColor = campoCor.value;
  return false;
}


let contador = 0;

function conta() {
  contador++;
  const resultado = document.getElementById('resultado');
  resultado.textContent = contador;
}

function resetContador() {
  contador = 0;
  const resultado = document.getElementById('resultado');
  resultado.textContent = contador;
}

function imgOver() {
  const foto = document.getElementById('foto');
  foto.style.filter = 'grayscale(1)';
}
function imgOut() {
  const foto = document.getElementById('foto');
  foto.style.filter = 'none';
}
