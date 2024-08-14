document.addEventListener("DOMContentLoaded", function() {
    // Personalizar título com o nome do usuário (exemplo)
    const nomeUsuario = "João"; // Esse valor pode vir de uma fonte dinâmica
    const titulo = document.getElementById("titulo");
    titulo.textContent = `Estamos quase lá, ${nomeUsuario}!`;

    // Validação do formulário
    const formulario = document.getElementById("formulario-cadastro");
    const campoSexo = document.getElementById("sexo");
    const btnContinuar = document.getElementById("btn-continuar");

    formulario.addEventListener("submit", function(event) {
        if (campoSexo.value === "") {
            event.preventDefault(); // Impede o envio do formulário
            alert("Por favor, selecione o seu sexo antes de continuar.");
        } else {
            btnContinuar.disabled = true; // Desativa o botão para evitar múltiplos cliques
            btnContinuar.textContent = "Processando...";
        }
    });
});