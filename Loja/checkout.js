const checkoutItems = document.getElementById("checkoutItems");
const productsTotal = document.getElementById("productsTotal");
const shippingTotal = document.getElementById("shippingTotal");
const orderTotal = document.getElementById("orderTotal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const successPanel = document.getElementById("successPanel");
const successText = document.getElementById("successText");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function formatarPreco(valor){
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function calcularResumo(){
    const produtos = carrinho.reduce((total, produto) => {
        return total + (produto.preco * produto.quantidade);
    }, 0);

    const frete = produtos >= 199 || produtos === 0 ? 0 : 14.9;

    return {
        produtos,
        frete,
        total: produtos + frete
    };
}

function renderizarResumo(){
    checkoutItems.innerHTML = "";

    if(carrinho.length === 0){
        checkoutItems.innerHTML = `
            <div class="empty-checkout" role="status">
                <p>Seu carrinho está vazio.</p>
                <a href="main.html" class="continue-btn">Escolher produtos</a>
            </div>
        `;

        productsTotal.textContent = "R$ 0,00";
        shippingTotal.textContent = "R$ 0,00";
        orderTotal.textContent = "R$ 0,00";
        checkoutForm.querySelector(".confirm-order-btn").disabled = true;
        return;
    }

    carrinho.forEach(produto => {
        const subtotal = produto.preco * produto.quantidade;

        checkoutItems.innerHTML += `
            <article class="checkout-item">
                <img src="${produto.imagem}" alt="${produto.nome}">

                <div>
                    <h3>${produto.nome}</h3>
                    <p>${produto.quantidade} unidade${produto.quantidade > 1 ? "s" : ""}</p>
                    <span>Subtotal: ${formatarPreco(subtotal)}</span>
                </div>
            </article>
        `;
    });

    const resumo = calcularResumo();

    productsTotal.textContent = formatarPreco(resumo.produtos);
    shippingTotal.textContent = resumo.frete === 0 ? "Grátis" : formatarPreco(resumo.frete);
    orderTotal.textContent = formatarPreco(resumo.total);
}

function validarFormulario(){
    const camposObrigatorios = checkoutForm.querySelectorAll("input[required]");

    for(const campo of camposObrigatorios){
        if(!campo.value.trim()){
            checkoutMessage.textContent = "Preencha todos os campos obrigatórios para confirmar o pedido.";
            campo.focus();
            return false;
        }
    }

    const email = document.getElementById("customerEmail");

    if(!email.value.includes("@")){
        checkoutMessage.textContent = "Digite um e-mail válido.";
        email.focus();
        return false;
    }

    return true;
}

checkoutForm.addEventListener("submit", event => {
    event.preventDefault();
    checkoutMessage.textContent = "";

    if(carrinho.length === 0 || !validarFormulario()){
        return;
    }

    const resumo = calcularResumo();
    const nome = document.getElementById("customerName").value.trim();
    const pagamento = checkoutForm.querySelector("input[name='payment']:checked").value;
    const pedidoId = Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("ultimoPedido", JSON.stringify({
        id: pedidoId,
        nome,
        pagamento,
        total: resumo.total,
        itens: carrinho
    }));

    localStorage.removeItem("carrinho");
    localStorage.removeItem("carrinhoQuantidade");
    carrinho = [];

    checkoutForm.hidden = true;
    document.querySelector(".checkout-steps").hidden = true;
    successText.textContent = `Pedido #${pedidoId} confirmado para ${nome}. Pagamento por ${pagamento}. Total ${formatarPreco(resumo.total)}.`;
    successPanel.hidden = false;
    successPanel.focus();
});

renderizarResumo();
