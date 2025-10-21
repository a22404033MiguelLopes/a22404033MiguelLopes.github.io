const KEY = "produtos-selecionados";
const ler = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const gravar = (dados) => localStorage.setItem(KEY, JSON.stringify(dados));

window.addEventListener("DOMContentLoaded", () => {
  carregarProdutos(produtos);
  atualizaCesto();
  document.getElementById("limpar-cesto").onclick = () => {
    gravar([]);
    atualizaCesto();
  };
});

function carregarProdutos(produtos) {
  const prod = document.getElementById("produtos");
  produtos.forEach(p => {
    prod.appendChild(criarProduto(p));
  });
}

function criarProduto(produto) {
  const artigo = document.createElement("article");
  artigo.innerHTML = `
    <h3>${produto.title}</h3>
    <figure><img src="${produto.image}" alt="${produto.title}"></figure>
    <p class="price">Preço: ${produto.price.toFixed(2)} €</p>
    <p class="desc">${produto.description}</p>
  `;
  const btn = document.createElement("button");
  btn.textContent = "+ Adicionar ao Cesto";
  btn.onclick = () => {
    const lista = ler();
    lista.push({
      id: produto.id,
      title: produto.title,
      price: produto.price,
      image: produto.image,
      description: produto.description
    });
    gravar(lista);
    atualizaCesto();
  };
  artigo.appendChild(btn);
  return artigo;
}

function atualizaCesto() {
  const cont = document.getElementById("lista-cesto");
  const lista = ler();
  cont.innerHTML = "";
  let total = 0;

  lista.forEach((p, i) => {
    total += p.price;
    cont.appendChild(criaProdutoCesto(p, i));
  });

  document.getElementById("total-cesto").textContent =
    "Total: " + total.toFixed(2) + " €";
}

function criaProdutoCesto(produto) {
  const artigo = document.createElement("article");
  artigo.innerHTML = `
    <h3>${produto.title}</h3>
    <figure><img src="${produto.image}" alt="${produto.title}"></figure>
    <p>Custo total: ${produto.price.toFixed(2)} €</p>
  `;

  const btn = document.createElement("button");
  btn.textContent = "− Remover do Cesto";
  btn.onclick = () => {
    const lista = ler();
    const i = lista.findIndex(p => p.id === produto.id);
    if (i !== -1) {
      lista.splice(i, 1);
      gravar(lista);
      atualizaCesto();
    }
  };
  artigo.appendChild(btn);

  return artigo;
}
