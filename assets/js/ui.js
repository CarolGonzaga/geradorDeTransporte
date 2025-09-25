import * as state from "./state.js";
import { validateAllFields } from "./validation.js";
import { applyBusinessRules } from "./rules.js";
import { generateExcel } from "./excelGenerator.js";

// ================= FUNÇÃO REUTILIZÁVEL PARA O POPUP =================
export function showPopupMessage(message) {
    state.infoPopupMessage.innerHTML = message;
    state.infoPopup.classList.add("show");
}
// =======================================================================

// Função de troca de abas (versão simples, sem validação)
function showTab(tabIndex) {
    state.tabPanes.forEach((pane, index) =>
        pane.classList.toggle("active", index === tabIndex)
    );
    state.tabLinks.forEach((link, index) =>
        link.classList.toggle("active", index === tabIndex)
    );
}

// Função para processar imagens coladas ou arrastadas (converte URLs para base64)
async function handleImageProcessing(area) {
    setTimeout(async () => {
        const img = area.querySelector("img");
        if (!img) return;
        const src = img.src;
        if (src.startsWith("data:image")) return;
        if (src.startsWith("http")) {
            img.style.opacity = "0.5";
            try {
                const response = await fetch(src);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    img.src = reader.result;
                    img.style.opacity = "1";
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error("Erro ao converter imagem da URL:", error);
                alert(
                    "Não foi possível converter a imagem a partir do link. Tente copiar a imagem em si, e não o link para ela."
                );
                area.innerHTML = "";
                img.style.opacity = "1";
            }
        }
    }, 100);
}

// Função para adicionar linhas de chave/valor
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
        });
        kvContainer.appendChild(clone);
    };

    addBtn.addEventListener("click", addPair);
}

// Função para criar as seções dinâmicas (Imagem + Chave/Valor)
function setupDynamicSection(radios, container, addButton) {
    const template = document.getElementById("externalization-entry-template");
    const addEntry = () => {
        const clone = template.content.cloneNode(true);
        const newEntry = clone.querySelector(".dynamic-entry");

        const pasteArea = newEntry.querySelector(".paste-area");
        pasteArea.setAttribute("data-required", "true");
        pasteArea.addEventListener("paste", () =>
            handleImageProcessing(pasteArea)
        );
        pasteArea.addEventListener("input", () =>
            handleImageProcessing(pasteArea)
        );
        newEntry
            .querySelectorAll(".externalization-name, .externalization-value")
            .forEach((input) => {
                input.setAttribute("required", "true");
            });
        const removeBtn = newEntry.querySelector(".remove-entry-btn");
        removeBtn.addEventListener("click", () => {
            newEntry.remove();
        });
        setupKeyValuePairs(newEntry);
        container.appendChild(clone);
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
        });
    });
    addButton.addEventListener("click", addEntry);
}

export function initializeUI() {
    state.form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (validateAllFields()) {
            generateExcel();
        } else {
            alert(
                "Preencha todos os campos obrigatórios destacados em vermelho antes de gerar a planilha."
            );
            const firstError = document.querySelector("#docForm .error");
            if (firstError) {
                const errorTabPane = firstError.closest(".tab-pane");
                if (errorTabPane) {
                    const tabId = errorTabPane.id.replace("tab", "");
                    showTab(parseInt(tabId) - 1);
                    firstError.querySelector("input, .paste-area")?.focus();
                }
            }
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

    setupKeyValuePairs(document.getElementById("senderSection"));

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
    document.querySelectorAll(".paste-area").forEach((area) => {
        area.addEventListener("paste", () => handleImageProcessing(area));
        area.addEventListener("input", () => handleImageProcessing(area));
    });

    // --- LÓGICA PARA O ITEM 11 (SENDER) ---
    state.senderRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            const isSim = this.value === "sim";
            state.senderSection.classList.toggle("hidden", !isSim);

            const fields = state.senderSection.querySelectorAll(
                'input[type="text"], .paste-area'
            );

            fields.forEach((field) => {
                if (isSim) {
                    field.setAttribute("required", "true");
                    if (field.classList.contains("paste-area")) {
                        field.setAttribute("data-required", "true");
                    }
                } else {
                    field.removeAttribute("required");
                    if (field.classList.contains("paste-area")) {
                        field.removeAttribute("data-required");
                    }
                }
            });
        });
    });
    // ------------------------------------

    state.apiMgmtRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            const isSim = this.value === "sim";
            state.apiMgmtDetails.classList.toggle("hidden", !isSim);
            state.apiMgmtDetails
                .querySelectorAll('input[type="text"], .paste-area')
                .forEach((input) => {
                    if (isSim) {
                        input.setAttribute("required", "true");
                        if (input.classList.contains("paste-area")) {
                            input.setAttribute("data-required", "true");
                        }
                    } else {
                        input.removeAttribute("required");
                        if (input.classList.contains("paste-area")) {
                            input.removeAttribute("data-required");
                        }
                    }
                });
        });
    });

    state.qasRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            const isHidden = this.value !== "não";
            state.qasImageUpload.classList.toggle("hidden", isHidden);
            const pasteArea = state.qasImageUpload.querySelector(".paste-area");
            if (isHidden) {
                pasteArea.removeAttribute("data-required");
            } else {
                pasteArea.setAttribute("data-required", "true");
            }
        });
    });

    [state.sapUserNA, state.sapEnvNA, state.userRoleNA].forEach((cb) => {
        const input = cb
            .closest(".with-na")
            .querySelector('input[type="text"]');
        cb.addEventListener("change", function () {
            const isChecked = this.checked;
            input.disabled = isChecked;
            if (isChecked) {
                input.removeAttribute("required");
                input.value = "N/A";
                input.style.backgroundColor = "#e9ecef";
            } else {
                input.setAttribute("required", "true");
                input.value = "";
                input.style.backgroundColor = "";
            }
        });
    });

    state.popupCloseBtn.addEventListener("click", () => {
        state.infoPopup.classList.remove("show");
    });

    // ================= Listener do Event Mesh ATUALIZADO =================
    state.eventMeshRadios.forEach((radio) => {
        radio.addEventListener("change", (event) => {
            if (event.target.value === "sim" && event.target.checked) {
                const eventMeshMessage =
                    "<strong>ATENÇÃO:</strong> Para transportar um <span>AEM</span> é necessário criar <u>3 planilhas diferentes</u>: 1 para o iFlow, 1 para a Fila Principal e 1 para a Fila Morta. Não esqueça de externalizar os nomes das filas <span>'QUEUE NAME'</span>, tanto para a <u>fila principal</u> como para a <u>fila morta (DMQ)</u>.";
                showPopupMessage(eventMeshMessage);
            }
            applyBusinessRules("eventMesh");
        });
    });

    // Listener do Nome do Pacote ATUALIZADO
    state.packageNameInput.addEventListener("blur", () => {
        // Chama a função de regras, informando que o gatilho foi o 'packageName'
        applyBusinessRules("packageName");
    });
    // ======================================================================

    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });
    showTab(0);
}
