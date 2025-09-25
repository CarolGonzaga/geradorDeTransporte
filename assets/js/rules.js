import * as state from "./state.js";
import { showPopupMessage } from "./ui.js";

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
export function applyBusinessRules(trigger) {
    const isEventMesh = state.eventMeshRadios[0].checked;
    const packageName = state.packageNameInput.value.toUpperCase().trim();

    // Se EventMesh for SIM, desabilita os campos 7, 8 e 9.
    if (isEventMesh) {
        setToNA(state.sapUserCredentialInput, state.sapUserNA); // Item 7
        setToNA(state.sapEnvInput, state.sapEnvNA); // Item 8
        setToNA(state.userRoleInput, state.userRoleNA); // Item 9
    } else {
        // Se for NÃO, aplica as regras padrão para os campos.
        // Regra para o Item 9 (User Role)
        if (state.userRoleMap[packageName]) {
            setValue(
                state.userRoleInput,
                state.userRoleNA,
                state.userRoleMap[packageName]
            );
        } else {
            setValue(state.userRoleInput, state.userRoleNA, "");
        }

        // Regra para o Item 8 (Ambiente SAP)
        if (packageName.includes("MDG")) {
            setValue(state.sapEnvInput, state.sapEnvNA, "S4QCLNT210");
        } else {
            setValue(state.sapEnvInput, state.sapEnvNA, "NC2CLNT210");
        }

        // Regra para o Item 7 (Usuário SAP)
        if (packageName.includes("PLANTSUITE")) {
            setToNA(state.sapUserCredentialInput, state.sapUserNA);
        } else {
            setValue(state.sapUserCredentialInput, state.sapUserNA, "");
        }
    }

    // Regra para exibir o popup de API Management (inalterada)
    const foundKeyword = state.apiKeywords.some((keyword) =>
        packageName.includes(keyword)
    );
    // SÓ MOSTRA o popup se a palavra-chave for encontrada E o gatilho for a mudança do nome do pacote
    if (foundKeyword && trigger === "packageName") {
        const apiMessage =
            "<strong>Aviso:</strong> possivelmente esse transporte terá <span>API Management</span>. </br>Confirme antes do envio!";
        showPopupMessage(apiMessage);

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
}
