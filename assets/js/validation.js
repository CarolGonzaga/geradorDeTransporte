// Valida um único campo e aplica ou remove o estilo de erro
export function validateField(element) {
    const formGroup = element.closest(".form-group");
    if (!formGroup) return true;

    let isValid = true;

    // Um campo só é obrigatório se estiver visível e tiver o atributo 'required'
    const isVisible = element.offsetParent !== null;
    const isRequired = !element.disabled && element.hasAttribute("required");

    if (!isVisible || !isRequired) {
        formGroup.classList.remove("error");
        return true;
    }

    // Validação para campos de texto
    if (element.matches('input[type="text"]')) {
        if (element.value.trim() === "") {
            isValid = false;
        }
    }
    // NOVO BLOCO para validar botões de rádio
    else if (element.matches('input[type="radio"]')) {
        const groupName = element.name;
        // Verifica se existe algum input checado dentro do mesmo grupo
        const anyChecked = document.querySelector(
            `input[name="${groupName}"]:checked`
        );
        if (!anyChecked) {
            isValid = false;
        }
    }
    // Validação para áreas de imagem
    else if (element.classList.contains("paste-area")) {
        if (!element.querySelector("img")) {
            isValid = false;
        }
    }

    if (isValid) {
        formGroup.classList.remove("error");
    } else {
        formGroup.classList.add("error");
    }

    return isValid;
}

// Valida todos os campos obrigatórios do formulário de uma vez
export function validateAllFields() {
    let isFormFullyValid = true;
    // Seleciona todos os elementos que podem ser obrigatórios
    const fieldsToValidate = document.querySelectorAll(
        '#docForm input[required], #docForm .paste-area[data-required="true"]'
    );

    fieldsToValidate.forEach((field) => {
        // A função validateField já verifica se o campo está visível e é obrigatório
        if (!validateField(field)) {
            isFormFullyValid = false;
        }
    });

    return isFormFullyValid;
}
