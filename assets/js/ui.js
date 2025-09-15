import * as state from "./state.js";
import { isFormValid } from "./validation.js";
import { applyBusinessRules, applyConfigureTabRules } from "./rules.js";
import { generateExcel } from "./excelGenerator.js";

function showTab(tabIndex) {
    state.tabPanes.forEach((pane, index) =>
        pane.classList.toggle("active", index === tabIndex)
    );
    state.tabLinks.forEach((link, index) =>
        link.classList.toggle("active", index === tabIndex)
    );
}

function updateButtonState() {
    state.generateButton.disabled = !isFormValid(false);
}

async function handleImageProcessing(area) {
    setTimeout(async () => {
        const img = area.querySelector("img");
        if (!img) {
            updateButtonState();
            return;
        }
        const src = img.src;
        if (src.startsWith("data:image")) {
            updateButtonState();
            return;
        }
        if (src.startsWith("http")) {
            img.style.opacity = "0.5";
            try {
                const response = await fetch(src);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    img.src = reader.result;
                    img.style.opacity = "1";
                    updateButtonState();
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error("Erro ao converter imagem da URL:", error);
                alert(
                    "Não foi possível converter a imagem a partir do link. Tente copiar a imagem em si, e não o link para ela. (Ex: use uma ferramenta de captura de tela)."
                );
                area.innerHTML = "";
                img.style.opacity = "1";
                updateButtonState();
            }
        }
    }, 100);
}

// --- FUNÇÃO PARA ADICIONAR LINHAS DE CHAVE/VALOR ---
function setupKeyValuePairs(container) {
    const addBtn = container.querySelector(".add-kv-btn");
    const kvContainer = container.querySelector(".key-value-container");
    const template = document.getElementById("key-value-pair-template");

    if (!addBtn || !kvContainer || !template) return;

    const addPair = () => {
        const clone = template.content.cloneNode(true);
        const newPair = clone.querySelector(".key-value-pair");
        const removeBtn = newPair.querySelector(".remove-kv-btn");
        removeBtn.addEventListener("click", () => {
            newPair.remove();
            updateButtonState();
        });
        kvContainer.appendChild(clone);
        // Valida o formulário após adicionar
        updateButtonState();
    };

    addBtn.addEventListener("click", addPair);
}

// --- FUNÇÃO PARA CRIAR AS SEÇÕES DINÂMICAS (IMAGEM + CHAVE/VALOR) ---
function setupDynamicSection(radios, container, addButton) {
    const template = document.getElementById("externalization-entry-template");
    const addEntry = () => {
        const clone = template.content.cloneNode(true);
        const newEntry = clone.querySelector(".dynamic-entry");

        const pasteArea = newEntry.querySelector(".paste-area");
        pasteArea.dataset.required = "true";
        pasteArea.addEventListener("paste", () =>
            handleImageProcessing(pasteArea)
        );
        pasteArea.addEventListener("input", () =>
            handleImageProcessing(pasteArea)
        );

        const inputs = newEntry.querySelectorAll('input[type="text"]');
        inputs.forEach((input) => (input.required = true));

        const removeBtn = newEntry.querySelector(".remove-entry-btn");
        removeBtn.addEventListener("click", () => {
            newEntry.remove();
            updateButtonState();
        });

        // Inicializa a funcionalidade de adicionar chave/valor para esta nova entrada
        setupKeyValuePairs(newEntry);

        container.appendChild(clone);
        updateButtonState();
    };

    radios.forEach((radio) => {
        radio.addEventListener("change", function () {
            const isSim = this.value === "sim";
            container.classList.toggle("hidden", !isSim);
            addButton.classList.toggle("hidden", !isSim);
            if (isSim && container.children.length === 0) {
                addEntry();
            } else if (!isSim) {
                container.innerHTML = "";
            }
            updateButtonState();
        });
    });
    addButton.addEventListener("click", addEntry);
}

export function initializeUI() {
    state.form.addEventListener("input", updateButtonState);
    state.form.addEventListener("change", updateButtonState);
    state.form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (isFormValid(true)) {
            generateExcel();
        }
    });

    state.tabLinks.forEach((link, index) => {
        link.addEventListener("click", () => showTab(index));
    });

    state.clearFormButton.addEventListener("click", () => {
        if (
            confirm(
                "Tem certeza que deseja limpar todos os campos e recomeçar?"
            )
        ) {
            location.reload();
        }
    });

    // --- LÓGICA DA ABA CONFIGURE ---
    state.userRoleInput.addEventListener("input", applyConfigureTabRules);
    state.userRoleNA.addEventListener("change", applyConfigureTabRules);

    // Inicializa a seção de chave/valor para o SENDER (Item 11)
    setupKeyValuePairs(document.getElementById("senderSection"));

    // Inicializa as seções dinâmicas (Items 12 e 13)
    setupDynamicSection(
        state.receiverRadios,
        state.receiverEntriesContainer,
        state.addReceiverEntryBtn
    );
    setupDynamicSection(
        state.moreRadios,
        state.moreEntriesContainer,
        state.addMoreEntryBtn
    );

    // Aplica o handler de imagem para todas as áreas de colar que já existem na página
    document.querySelectorAll(".paste-area").forEach((area) => {
        area.addEventListener("paste", () => handleImageProcessing(area));
        area.addEventListener("input", () => handleImageProcessing(area));
    });

    state.apiMgmtRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            const isSim = this.value === "sim";
            state.apiMgmtDetails.classList.toggle("hidden", !isSim);
            state.apiMgmtDetails
                .querySelectorAll('input[type="text"]')
                .forEach((input) => (input.required = isSim));
        });
    });

    state.qasRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            state.qasImageUpload.classList.toggle(
                "hidden",
                this.value !== "não"
            );
        });
    });

    [state.sapUserNA, state.sapEnvNA, state.userRoleNA].forEach((cb) => {
        const input = cb
            .closest(".with-na")
            .querySelector('input[type="text"]');
        cb.addEventListener("change", function () {
            const isChecked = this.checked;
            input.disabled = isChecked;
            input.required = !isChecked;
            if (isChecked) {
                input.value = "N/A";
                input.style.backgroundColor = "#e9ecef";
            } else {
                input.value = "";
                input.style.backgroundColor = "#fff";
            }
        });
    });

    state.eventMeshRadios.forEach((radio) =>
        radio.addEventListener("change", applyBusinessRules)
    );
    state.packageNameInput.addEventListener("blur", applyBusinessRules);

    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const icon = themeToggle.querySelector("i");
        if (document.body.classList.contains("dark")) {
            icon.classList.replace("fa-moon", "fa-sun");
        } else {
            icon.classList.replace("fa-sun", "fa-moon");
        }
    });

    // --- INICIALIZAÇÃO VISUAL ---
    showTab(0);
    updateButtonState();
}
