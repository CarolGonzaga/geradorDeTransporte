import { initializeUI } from "./ui.js";
import { applyBusinessRules } from "./rules.js";

document.addEventListener("DOMContentLoaded", () => {
    // Inicializa toda a interface e os event listeners
    initializeUI();
    // Aplica as regras de negócio iniciais
    applyBusinessRules();
});
