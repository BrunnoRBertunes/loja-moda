const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));

const img = document.getElementById("produto-img");
const nome = document.getElementById("produto-nome");
const preco = document.getElementById("produto-preco");
const addProductCart = document.getElementById("addProductCart");
const toast = document.getElementById("toast");
const productArea = document.querySelector(".product-area");

function corrigirTextosVisuais(){
    const correcoes = [
        ["conteÃºdo", "conteúdo"],
        ["pÃ¡gina", "página"],
        ["DescriÃ§Ã£o", "Descrição"],
        ["grÃ¡tis", "grátis"],
        ["DevoluÃ§Ã£o", "Devolução"],
        ["AtÃ©", "Até"],
        ["apÃ³s", "após"],
        ["avaliaÃ§Ãµes", "avaliações"],
        ["CalÃ§a", "Calça"],
        ["BonÃ©", "Boné"],
        ["TÃªnis", "Tênis"],
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

        ["aria-label", "alt"].forEach(atributo => {
            const valor = elemento.getAttribute?.(atributo);
            if(!valor) return;

            let texto = valor;
            correcoes.forEach(([errado, certo]) => {
                texto = texto.replaceAll(errado, certo);
            });
            elemento.setAttribute(atributo, texto);
        });
    });
}

if(produto){
    img.src = produto.imagem;
    img.alt = produto.nome;
    nome.textContent = produto.nome;
    preco.textContent = produto.preco;
}else{
    img.src = "img/camiseta-azul.png";
    img.alt = "Camiseta Infinity Azul";
    nome.textContent = "Camiseta Infinity Azul";
    preco.textContent = "R$ 45,99";
}

document.querySelectorAll(".sizes button").forEach(botao => {
    botao.addEventListener("click", () => {
        document.querySelectorAll(".sizes button").forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-checked", "false");
        });

        botao.classList.add("active");
        botao.setAttribute("aria-checked", "true");
    });
});

function mostrarToast(mensagem = "Produto adicionado ao carrinho!"){
    toast.textContent = mensagem;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

addProductCart.addEventListener("click", () => {
    const tamanhoSelecionado = document.querySelector(".sizes button.active");

    if(!tamanhoSelecionado){
        mostrarToast("Selecione um tamanho antes de adicionar.");
        document.querySelector(".sizes button")?.focus();
        return;
    }

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const precoNumero = Number(
        preco.textContent
            .replace("R$", "")
            .replace(",", ".")
            .trim()
    );

    const produtoCarrinho = {
        nome: `${nome.textContent} - Tam. ${tamanhoSelecionado.textContent}`,
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

function atualizarProdutoSelecionado(novoProduto){
    productArea.classList.add("product-changing");

    setTimeout(() => {
        img.src = novoProduto.imagem;
        img.alt = novoProduto.nome;
        nome.textContent = novoProduto.nome;
        preco.textContent = novoProduto.preco;

        document.querySelectorAll(".sizes button").forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-checked", "false");
        });

        localStorage.setItem("produtoSelecionado", JSON.stringify(novoProduto));
        productArea.classList.remove("product-changing");
        productArea.focus();
        productArea.scrollIntoView({
            behavior: document.body.classList.contains("reduce-motion") ? "auto" : "smooth",
            block: "start"
        });
    }, 220);
}

document.querySelectorAll(".related-card").forEach(card => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    card.addEventListener("click", () => {
        const novoProduto = {
            nome: card.querySelector("h4").innerText,
            imagem: card.querySelector("img").getAttribute("src"),
            preco: card.querySelector("p").innerText
        };

        atualizarProdutoSelecionado(novoProduto);
    });

    card.addEventListener("keydown", event => {
        if(event.key === "Enter" || event.key === " "){
            event.preventDefault();
            card.click();
        }
    });
});

corrigirTextosVisuais();
