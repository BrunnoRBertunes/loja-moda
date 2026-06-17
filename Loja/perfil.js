const userEmail = localStorage.getItem("usuarioLogado");
const userEmailElement = document.getElementById("user-email");
const userNameElement = document.getElementById("user-name");
const logoutBtn = document.getElementById("logoutBtn");
const contadorBaixo = document.getElementById("cart-count-bottom");

if(userEmail){
    userEmailElement.textContent = userEmail;

    const nome = userEmail.split("@")[0];
    userNameElement.textContent = nome.charAt(0).toUpperCase() + nome.slice(1);
}

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const totalItens = carrinho.reduce((total, produto) => {
    return total + (produto.quantidade || 1);
}, 0);

contadorBaixo.textContent = totalItens;

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});