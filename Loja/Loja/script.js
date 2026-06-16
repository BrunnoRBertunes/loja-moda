let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const contadores = document.querySelectorAll(".cart-count");
const toast = document.getElementById("toast");

function atualizarContador(){
    const totalItens = carrinho.reduce((total, produto) => {
        return total + (produto.quantidade || 1);
    }, 0);

    contadores.forEach(contador => {
        contador.textContent = totalItens;

        contador.classList.add("bump");

        setTimeout(() => {
            contador.classList.remove("bump");
        }, 350);
    });
}

function mostrarToast(){
    if(!toast) return;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

document.querySelectorAll(".add-cart").forEach(botao => {
    botao.addEventListener("click", function(event){
        event.preventDefault();

        const card = this.closest(".card, .market-card");

        const produto = {
            nome: card.querySelector("h3").innerText,
            imagem: card.querySelector("img").getAttribute("src"),
            preco: Number(
                (card.querySelector(".price") || card.querySelector("p"))
                .innerText
                .replace("R$", "")
                .replace(".", "")
                .replace(",", ".")
                .trim()
            ),
            quantidade: 1
        };

        const produtoExistente = carrinho.find(item => item.nome === produto.nome);

        if(produtoExistente){
            produtoExistente.quantidade++;
        }else{
            carrinho.push(produto);
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        atualizarContador();
        mostrarToast();
    });
});

atualizarContador();

document.querySelector(".cart-top")?.addEventListener("click", () => {
    window.location.href = "carrinho.html";
});

document.querySelector(".cart-bottom")?.addEventListener("click", () => {
    window.location.href = "carrinho.html";
});

document.querySelectorAll(".market-card, .card").forEach(card => {
    card.addEventListener("click", function(event){

        if(event.target.closest(".add-cart")){
            return;
        }

        const produto = {
            nome: card.querySelector("h3").innerText,
            imagem: card.querySelector("img").getAttribute("src"),
            preco: card.querySelector(".price, p").innerText
        };

        localStorage.setItem("produtoSelecionado", JSON.stringify(produto));

        window.location.href = "produto.html";
    });
});

const searchInput = document.querySelector(".search-box input");

if(searchInput){
    searchInput.addEventListener("input", () => {
        const texto = searchInput.value.toLowerCase().trim();

        const produtos = document.querySelectorAll(".card, .market-card, .seller-card");

        produtos.forEach(produto => {
            const nome = produto.querySelector("h3, h4")?.innerText.toLowerCase() || "";

            if(nome.includes(texto)){
                produto.style.display = "";
            }else{
                produto.style.display = "none";
            }
        });
    });
}