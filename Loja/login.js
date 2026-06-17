const loginForm = document.getElementById("loginForm");

const email = document.querySelector('input[type="email"]');
const senha = document.querySelector('input[type="password"]');
const mensagem = document.getElementById("login-message");
const toggleSenha = document.querySelector(".eye");

toggleSenha?.addEventListener("click", () => {
    const senhaVisivel = senha.type === "text";
    senha.type = senhaVisivel ? "password" : "text";
    toggleSenha.setAttribute("aria-label", senhaVisivel ? "Mostrar senha" : "Ocultar senha");
});

loginForm.addEventListener("submit", function(event){

    event.preventDefault();

    mensagem.textContent = "";

    const emailValue = email.value.trim();
    const senhaValue = senha.value.trim();

    if(emailValue === ""){
        mensagem.textContent = "Digite seu e-mail.";
        email.focus();
        return;
    }

    if(!emailValue.includes("@")){
        mensagem.textContent = "Digite um e-mail válido.";
        email.focus();
        return;
    }

    if(senhaValue === ""){
        mensagem.textContent = "Digite sua senha.";
        senha.focus();
        return;
    }

    if(senhaValue.length < 6){
        mensagem.textContent = "A senha deve ter pelo menos 6 caracteres.";
        senha.focus();
        return;
    }

    localStorage.setItem("usuarioLogado", emailValue);

    window.location.href = "main.html";

});
