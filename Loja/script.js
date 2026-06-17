let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const contadores = document.querySelectorAll(".cart-count");
const toast = document.getElementById("toast");
const searchInput = document.querySelector(".search-box input");
const searchStatus = document.getElementById("search-status");
const filterChips = document.querySelectorAll(".filter-chip");

function corrigirTextosVisuais(){
    const correcoes = [
        ["conteÃºdo", "conteúdo"],
        ["notificaÃ§Ãµes", "notificações"],
        ["PromoÃ§Ã£o", "Promoção"],
        ["CalÃ§a", "Calça"],
        ["calÃ§a", "calça"],
        ["BonÃ©", "Boné"],
        ["bonÃ©", "boné"],
        ["TÃªnis", "Tênis"],
        ["tÃªnis", "tênis"],
        ["vocÃª", "você"],
        ["InÃ­cio", "Início"],
        ["NavegaÃ§Ã£o", "Navegação"],
        ["ConfiguraÃ§Ãµes", "Configurações"],
        ["â˜…", "★"]
    ];

    document.querySelectorAll("body *").forEach(elemento => {
        if(elemento.children.length === 0 && elemento.textContent){
            let texto = elemento.textContent;

            correcoes.forEach(([errado, certo]) => {
                texto = texto.replaceAll(errado, certo);
            });

            elemento.textContent = texto;
        }

        ["aria-label", "alt", "placeholder"].forEach(atributo => {
            const valor = elemento.getAttribute?.(atributo);
            if(!valor) return;

            let texto = valor;
            correcoes.forEach(([errado, certo]) => {
                texto = texto.replaceAll(errado, certo);
            });
            elemento.setAttribute(atributo, texto);
        });
    });

    document.querySelectorAll("img").forEach(imagem => {
        if(imagem.getAttribute("src")?.includes("calÃ§a-bege")){
            imagem.setAttribute("src", "img/calça-bege.jfif");
        }
    });
}

function prepararCardsAcessiveis(){
    document.querySelectorAll(".market-card, .card").forEach(card => {
        const titulo = card.querySelector("h3")?.innerText.trim();
        const imagem = card.querySelector("img");
        const botao = card.querySelector(".add-cart");

        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "link");
        card.setAttribute("aria-label", `Ver detalhes de ${titulo}`);

        if(!card.querySelector(".favorite-btn")){
            const favorito = document.createElement("button");
            favorito.className = "favorite-btn";
            favorito.type = "button";
            favorito.setAttribute("aria-label", `Favoritar ${titulo}`);
            favorito.innerHTML = `<i class="fa-regular fa-heart" aria-hidden="true"></i>`;
            card.prepend(favorito);

            favorito.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                favorito.classList.toggle("active");
                favorito.innerHTML = favorito.classList.contains("active")
                    ? `<i class="fa-solid fa-heart" aria-hidden="true"></i>`
                    : `<i class="fa-regular fa-heart" aria-hidden="true"></i>`;
            });
        }

        if(imagem && titulo){
            imagem.setAttribute("alt", titulo);
        }

        if(botao && titulo){
            botao.setAttribute("type", "button");
            botao.setAttribute("aria-label", `Adicionar ${titulo} ao carrinho`);
            botao.querySelector("i")?.setAttribute("aria-hidden", "true");
        }
    });
}

function atualizarContador(){
    const totalItens = carrinho.reduce((total, produto) => {
        return total + (produto.quantidade || 1);
    }, 0);

    contadores.forEach(contador => {
        contador.textContent = totalItens;
        contador.closest(".cart-top, .cart-bottom")?.setAttribute(
            "aria-label",
            `Abrir carrinho com ${totalItens} ${totalItens === 1 ? "item" : "itens"}`
        );

        contador.classList.add("bump");

        setTimeout(() => {
            contador.classList.remove("bump");
        }, 350);
    });
}

function mostrarToast(){
    if(!toast) return;

    toast.classList.add("show");
    toast.textContent = "Produto adicionado ao carrinho!";

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

        if(event.target.closest(".add-cart, .favorite-btn")){
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

    card.addEventListener("keydown", function(event){
        if(event.key === "Enter" || event.key === " "){
            if(event.target.closest(".add-cart")){
                return;
            }

            event.preventDefault();
            card.click();
        }
    });
});

if(searchInput){
    searchInput.addEventListener("input", () => {
        const texto = searchInput.value.toLowerCase().trim();

        const produtos = document.querySelectorAll(".card, .market-card, .seller-card");
        let encontrados = 0;

        produtos.forEach(produto => {
            const nome = produto.querySelector("h3, h4")?.innerText.toLowerCase() || "";

            if(nome.includes(texto)){
                produto.style.display = "";
                encontrados++;
            }else{
                produto.style.display = "none";
            }
        });

        if(searchStatus){
            searchStatus.textContent = `${encontrados} produtos encontrados.`;
        }
    });
}

filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
        const filtro = chip.dataset.filter;

        filterChips.forEach(item => item.classList.remove("active"));
        chip.classList.add("active");

        document.querySelectorAll(".market-card, .card").forEach(produto => {
            const nome = produto.querySelector("h3")?.innerText
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") || "";

            produto.style.display = filtro === "todos" || nome.includes(filtro) ? "" : "none";
        });
    });
});

corrigirTextosVisuais();
prepararCardsAcessiveis();
