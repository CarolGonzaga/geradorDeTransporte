import * as state from "./state.js";

export function isFormValid(showAlerts) {
    for (const input of state.form.querySelectorAll(
        'input[type="text"][required]'
    )) {
        if (!input.disabled && !input.value.trim()) {
            if (showAlerts) {
                alert(`O campo "${input.labels[0].innerText}" é obrigatório.`);
                input.focus();
            }
            return false;
        }
    }
    const qasSelection = state.form.querySelector(
        'input[name="inQAS"]:checked'
    );
    if (!qasSelection) {
        if (showAlerts)
            alert(
                'Por favor, selecione uma opção para o "Item 3. Pacote já está em QAS?".'
            );
        return false;
    }
    const imageContainers = [
        { element: state.qasImageUpload, name: "Evidência de QAS" },
        { element: state.iflowImageUpload, name: "Evidência do iFlow" },
    ];
    for (const containerInfo of imageContainers) {
        if (!containerInfo.element.classList.contains("hidden")) {
            // Validação das áreas de colar imagem (MODIFICADO)
            const allPasteAreas = state.form.querySelectorAll(".paste-area");
            for (const pasteArea of allPasteAreas) {
                // Verifica se a área está visível e marcada como obrigatória
                const isVisible = pasteArea.offsetParent !== null;
                const isRequired = pasteArea.dataset.required === "true";

                if (
                    isVisible &&
                    isRequired &&
                    !pasteArea.querySelector("img")
                ) {
                    if (showAlerts) {
                        const fieldName =
                            pasteArea.dataset.fieldName ||
                            pasteArea.previousElementSibling.innerText;
                        alert(`A imagem para "${fieldName}" é obrigatória.`);
                        pasteArea.classList.add("error");
                        pasteArea.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }
                    return false;
                } else {
                    pasteArea.classList.remove("error");
                }
            }
        }
    }
    if (state.apiMgmtYes.checked) {
        const apiImageAreas =
            state.apiMgmtDetails.querySelectorAll(".paste-area");
        for (const area of apiImageAreas) {
            if (!area.querySelector("img")) {
                if (showAlerts) {
                    alert(
                        `A imagem para "${area.dataset.fieldName}" é obrigatória.`
                    );
                    area.classList.add("error");
                }
                return false;
            }
        }
    }
    return true;
}
