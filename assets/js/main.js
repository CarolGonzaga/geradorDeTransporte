import { initializeUI } from "./ui.js";
import { applyBusinessRules } from "./rules.js";
import { initializeTheme } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
    // Inicializa o tema primeiro para evitar "flash" de conteúdo
    initializeTheme();
    // Inicializa toda a interface e os event listeners
    initializeUI();
    // Aplica as regras de negócio iniciais
    applyBusinessRules('initialLoad');
});
