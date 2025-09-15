import * as state from "./state.js";

// Funções auxiliares (usadas apenas aqui)
function setToNA(input, checkbox) {
    input.value = "N/A";
    input.disabled = true;
    checkbox.checked = true;
    input.style.backgroundColor = "#e9ecef";
    input.required = false;
}

function setValue(input, checkbox, value) {
    input.value = value;
    input.disabled = false;
    checkbox.checked = false;
    input.style.backgroundColor = "#fff";
    input.required = true;
}

// Função principal de regras de negócio
export function applyBusinessRules() {
    const isEventMesh = state.eventMeshRadios[0].checked;
    const packageName = state.packageNameInput.value.toUpperCase().trim();
    if (state.userRoleMap[packageName]) {
        setValue(
            state.userRoleInput,
            state.userRoleNA,
            state.userRoleMap[packageName]
        );
    } else {
        setValue(state.userRoleInput, state.userRoleNA, "");
    }
    if (isEventMesh) {
        setToNA(state.sapEnvInput, state.sapEnvNA);
    } else {
        setValue(state.sapEnvInput, state.sapEnvNA, "NC2CLNT210");
    }
    setValue(state.sapUserCredentialInput, state.sapUserNA, "");
    if (packageName.includes("PLM") && isEventMesh) {
        setToNA(state.sapUserCredentialInput, state.sapUserNA);
        setToNA(state.sapEnvInput, state.sapEnvNA);
        setToNA(state.userRoleInput, state.userRoleNA);
    } else if (packageName.includes("EVOLUTIO") && !isEventMesh) {
        setValue(state.sapUserCredentialInput, state.sapUserNA, "");
        setValue(state.sapEnvInput, state.sapEnvNA, "NC2CLNT210");
    } else if (packageName.includes("PLM") && !isEventMesh) {
        setValue(state.sapUserCredentialInput, state.sapUserNA, "");
        setValue(state.sapEnvInput, state.sapEnvNA, "NC2CLNT210");
    } else if (packageName.includes("PLANTSUITE") && !isEventMesh) {
        setToNA(state.sapUserCredentialInput, state.sapUserNA);
        setToNA(state.sapEnvInput, state.sapEnvNA);
    } else if (packageName.includes("MDG") && !isEventMesh) {
        setValue(state.sapUserCredentialInput, state.sapUserNA, "");
        setValue(state.sapEnvInput, state.sapEnvNA, "S4QCLNT210");
    } else if (packageName.includes("LIMS") && !isEventMesh) {
        setValue(state.sapUserCredentialInput, state.sapUserNA, "");
        setValue(state.sapEnvInput, state.sapEnvNA, "NC2CLNT210");
    }
    const foundKeyword = state.apiKeywords.some((keyword) =>
        packageName.includes(keyword)
    );
    if (foundKeyword) {
        state.apiPopup.classList.add("show");
        setTimeout(() => {
            state.apiPopup.classList.remove("show");
        }, 4000);
        if (!state.apiMgmtYes.checked) {
            state.apiMgmtYes.checked = true;
            state.apiMgmtYes.dispatchEvent(new Event("change"));
        }
    } else {
        if (!state.apiMgmtNo.checked) {
            state.apiMgmtNo.checked = true;
            state.apiMgmtNo.dispatchEvent(new Event("change"));
        }
    }

    applyConfigureTabRules();
}

// Função para controlar a lógica da aba "Configure"
export function applyConfigureTabRules() {
    const userRoleValue = state.userRoleInput.value;
    const isUserRoleNA =
        state.userRoleNA.checked || userRoleValue.toUpperCase() === "N/A";

    // Regra do item 11 (Sender Section)
    if (!isUserRoleNA && userRoleValue.trim() !== "") {
        state.senderSection.classList.remove("hidden");
        state.senderSection.querySelector(".paste-area").dataset.required =
            "true"; // Marca para validação
        state.senderExternalizationValue.value = userRoleValue;
    } else {
        state.senderSection.classList.add("hidden");
        state.senderSection.querySelector(".paste-area").dataset.required =
            "false";
        state.senderExternalizationValue.value = "";
    }
}