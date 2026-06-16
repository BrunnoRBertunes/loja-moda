const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));

const img = document.getElementById("produto-img");
const nome = document.getElementById("produto-nome");
const preco = document.getElementById("produto-preco");
const addProductCart = document.getElementById("addProductCart");
const toast = document.getElementById("toast");

if(produto){
    img.src = produto.imagem;
    nome.textContent = produto.nome;
    preco.textContent = produto.preco;
}else{
    img.src = "img/camiseta-azul.png";
    nome.textContent = "Camiseta Infinity Azul";
    preco.textContent = "R$ 45,99";
}

document.querySelectorAll(".sizes button").forEach(botao => {
    botao.addEventListener("click", () => {
        document.querySelectorAll(".sizes button").forEach(btn => {
            btn.classList.remove("active");
        });

        botao.classList.add("active");
    });
});

function mostrarToast(){
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

addProductCart.addEventListener("click", () => {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const precoNumero = Number(
        preco.textContent
            .replace("R$", "")
            .replace(",", ".")
            .trim()
    );

    const produtoCarrinho = {
        nome: nome.textContent,
        imagem: img.getAttribute("src"),
        preco: precoNumero,
        quantidade: 1
    };

    const existente = carrinho.find(item => item.nome === produtoCarrinho.nome);

    if(existente){
        existente.quantidade++;
    }else{
        carrinho.push(produtoCarrinho);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    mostrarToast();
});

document.querySelectorAll(".related-card").forEach(card => {
    card.addEventListener("click", () => {
        const novoProduto = {
            nome: card.querySelector("h4").innerText,
            imagem: card.querySelector("img").getAttribute("src"),
            preco: card.querySelector("p").innerText
        };

        localStorage.setItem("produtoSelecionado", JSON.stringify(novoProduto));

        location.reload();
    });
});