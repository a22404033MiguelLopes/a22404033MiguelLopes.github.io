let todosProdutos = [];

function ler() { 
  return JSON.parse(localStorage.getItem("produtos-selecionados") || "[]"); 
}

function gravar(artigos){ 
  localStorage.setItem("produtos-selecionados", JSON.stringify(artigos)); 
}

document.addEventListener("DOMContentLoaded", () => {
  carregarCategorias();
  carregarProdutos();

  document.getElementById("limpar-cesto").addEventListener("click", () => {
    gravar([]); 
    atualizaCesto();
  });

  document.getElementById("filtro-categoria").addEventListener("change", aplicarFiltro);
  document.getElementById("ordenar").addEventListener("change", aplicarFiltro);
  document.getElementById("pesquisar").addEventListener("input", aplicarFiltro);
  document.getElementById("comprar").addEventListener("click", comprar);
});

function carregarCategorias() {
  fetch("https://deisishop.pythonanywhere.com" + "/categories")
    .then(res => res.json())
    .then(categorias => {
      const filtro = document.getElementById("filtro-categoria");
      categorias.forEach(cat => {
        const opcao = document.createElement("option");
        opcao.value = cat; opcao.textContent = cat;
        filtro.appendChild(opcao);
      });
    })
    .catch(() => {});
}

function carregarProdutos() {
  fetch("https://deisishop.pythonanywhere.com" + "/products")
    .then(res => res.json())
    .then(produtos => {
      todosProdutos = produtos;
      aplicarFiltro();
      atualizaCesto();
    })
    .catch(() => {
      document.getElementById("grade-produtos").innerHTML = "<p>Erro ao carregar produtos.</p>";
    });
}

function aplicarFiltro() {
  const categoria = document.getElementById("filtro-categoria").value;
  const ordenacao = document.getElementById("ordenar").value;
  const pesquisa   = document.getElementById("pesquisar").value.trim().toLowerCase(); 

  let lista = todosProdutos.slice();

  if (categoria) lista = lista.filter(p => (p.category || "") === categoria);

  if (pesquisa) lista = lista.filter(p => (p.title || "").toLowerCase().includes(pesquisa));

  if (ordenacao === "asc") lista.sort((a,b) => a.price - b.price);
  if (ordenacao === "desc") lista.sort((a,b) => b.price - a.price);

  mostrarProdutos(lista);
}

function mostrarProdutos(lista) {
  const grade = document.getElementById("grade-produtos");
  grade.innerHTML = "";
  lista.forEach(p => grade.appendChild(criarProduto(p)));
}

function criarProduto(produto) {
  const artigo = document.createElement("article");
  artigo.innerHTML =
    "<h3>" + produto.title + "</h3>" +
    '<figure><img src="' + produto.image + '" alt="' + produto.title + '"></figure>' +
    '<p class="price">Preço: ' + produto.price.toFixed(2) + ' €</p>' +
    '<p class="desc">' + produto.description + "</p>";

  const btn = document.createElement("button");
  btn.textContent = "+ Adicionar ao Cesto";
  btn.addEventListener("click", () => {
    const lista = ler();
    lista.push({ id:produto.id, title:produto.title, price:produto.price, image:produto.image, description:produto.description });
    gravar(lista); atualizaCesto();
  });

  artigo.appendChild(btn);
  return artigo;
}

function atualizaCesto() {
  const cesto = document.getElementById("lista-cesto");
  const lista = ler();
  cesto.innerHTML = "";
  let total = 0;

  lista.forEach(item => {
    total += item.price;
    cesto.appendChild(criaProdutoCesto(item));
  });

  document.getElementById("total-cesto").textContent = "Total: " + total.toFixed(2) + " €";
}

function criaProdutoCesto(produto) {
  const artigo = document.createElement("article");
  artigo.innerHTML =
    "<h3>" + produto.title + "</h3>" +
    '<figure><img src="' + produto.image + '" alt="' + produto.title + '"></figure>' +
    "<p>Custo total: " + produto.price.toFixed(2) + " €</p>";

  const btn = document.createElement("button");
  btn.textContent = "− Remover do Cesto";
  btn.addEventListener("click", () => {
    const lista = ler();
    const i = lista.findIndex(x => x.id === produto.id);
    if (i !== -1) { 
      lista.splice(i, 1); 
      gravar(lista); 
      atualizaCesto(); 
    }
  });

  artigo.appendChild(btn);
  return artigo;
}

function idsDoCesto() {
  return ler().map(p => p.id);
}

function mostrarResultadoOk(data) {
  const div = document.getElementById("resultado-compra");
  div.innerHTML =
    '<div class="ok">' +
      (data.message ? ('<p>'+data.message+'</p>') : '') +
      '<p><strong>Total:</strong> ' + (data.totalCost || '—') + ' €</p>' +
      '<p><strong>Referência:</strong> ' + (data.reference || '—') + '</p>' +
    '</div>';
}

function mostrarErro(msg) {
  const div = document.getElementById("resultado-compra");
  div.innerHTML = '<div class="erro">' + (msg || "Ocorreu um erro") + '</div>';
}

function comprar() {
  const btn = document.getElementById("comprar");
  const produtos = idsDoCesto();

  if (produtos.length === 0) {
    mostrarErro("O cesto está vazio.");
    return;
  }

  const body = {
    products: produtos,
    student: document.getElementById("student").checked,
    coupon: (document.getElementById("coupon").value || "").trim(),
    name: (document.getElementById("nome").value || "Cliente").trim()
  };

  document.getElementById("resultado-compra").textContent = "A processar compra...";
  btn.disabled = true;

  fetch("https://deisishop.pythonanywhere.com/buy/", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(body)
  })
  .then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      mostrarResultadoOk(data);
    } else {
      mostrarErro(data.error || ("Erro " + res.status));
    }
  })
  .catch(() => mostrarErro("Falha de rede."))
  .finally(() => { btn.disabled = false; });
}
