const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkoutBtn");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function mostrarCarrinho(){
    cartItems.innerHTML = "";

    if(carrinho.length === 0){
        cartItems.innerHTML = `
            <div class="empty-cart" role="status">
                <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
                <p>Seu carrinho está vazio.</p>
            </div>
        `;

        totalPrice.textContent = "R$ 0,00";
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Carrinho vazio";
        return;
    }

    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Finalizar Pedido";

    let total = 0;

    carrinho.forEach((produto, index) => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        cartItems.innerHTML += `
            <article class="cart-card">
                <img src="${produto.imagem}" alt="${produto.nome}">

                <div class="cart-info">
                    <h3>${produto.nome}</h3>
                    <p>R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>

                    <div class="quantity-box">
                        <button type="button" aria-label="Diminuir quantidade de ${produto.nome}" onclick="diminuirQuantidade(${index})">-</button>
                        <span aria-label="Quantidade ${produto.quantidade}">${produto.quantidade}</span>
                        <button type="button" aria-label="Aumentar quantidade de ${produto.nome}" onclick="aumentarQuantidade(${index})">+</button>
                    </div>

                    <small>
                        Subtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}
                    </small>
                </div>

                <button class="remove-btn" type="button" aria-label="Remover ${produto.nome} do carrinho" onclick="removerProduto(${index})">
                    <i class="fa-solid fa-trash" aria-hidden="true"></i>
                </button>
            </article>
        `;
    });

    totalPrice.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

function aumentarQuantidade(index){
    carrinho[index].quantidade++;
    salvarCarrinho();
}

function diminuirQuantidade(index){
    if(carrinho[index].quantidade > 1){
        carrinho[index].quantidade--;
    }else{
        carrinho.splice(index, 1);
    }

    salvarCarrinho();
}

function removerProduto(index){
    carrinho.splice(index, 1);
    salvarCarrinho();
}

function salvarCarrinho(){
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    localStorage.setItem("carrinhoQuantidade", carrinho.reduce((total, produto) => total + produto.quantidade, 0));

    mostrarCarrinho();
}

mostrarCarrinho();

checkoutBtn.addEventListener("click", () => {
    if(carrinho.length === 0){
        return;
    }

    window.location.href = "checkout.html";
});
