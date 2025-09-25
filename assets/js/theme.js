/**
 * Inicializa a funcionalidade de troca de tema.
 * Aplica o tema salvo no localStorage e adiciona o listener ao botão de troca.
 */
export function initializeTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    /**
     * Verifica o localStorage e aplica a classe 'dark' ao body se necessário.
     * Sincroniza o estado do checkbox do seletor de tema.
     */
    const applySavedTheme = () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            body.classList.add("dark");
            if (themeToggle) {
                themeToggle.checked = true;
            }
        } else {
            body.classList.remove("dark");
            if (themeToggle) {
                themeToggle.checked = false;
            }
        }
    };

    // Aplica o tema salvo assim que o script é executado
    applySavedTheme();

    // Adiciona o listener de clique apenas se o botão de tema existir na página atual
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark");

            // Salva ou remove a preferência do usuário no localStorage
            if (body.classList.contains("dark")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.removeItem("theme"); // Limpa para manter o tema claro como padrão
            }
        });
    }
}
