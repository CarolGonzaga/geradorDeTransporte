import * as state from "./state.js";
import { buildModel1 } from "./models/modelBuilder1.js";
import { buildModel2 } from "./models/modelBuilder2.js";
import { buildModel3 } from "./models/modelBuilder3.js";
import { buildModel4 } from "./models/modelBuilder4.js";

function getImageData(container) {
    if (!container) return null;
    const img = container.querySelector("img");
    if (!img || !img.src) return null;
    const match = img.src.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) return null;

    return {
        extension: match[1] === "jpeg" ? "jpg" : match[1],
        base64: match[2],
    };
}

export async function generateExcel() {
    try {
        // Função auxiliar para coletar os múltiplos pares de chave/valor
        const collectKeyValues = (element) => {
            const pairs = [];
            element.querySelectorAll(".key-value-pair").forEach((pair) => {
                const nameInput = pair.querySelector(".externalization-name");
                const valueInput = pair.querySelector(".externalization-value");
                if (nameInput && valueInput) {
                    pairs.push({
                        name: nameInput.value,
                        value: valueInput.value,
                    });
                }
            });
            return pairs;
        };

        const formData = {
            packageName: state.packageNameInput.value,
            iflowName: state.iflowNameInput.value,
            sapUserCreated: document.querySelector(
                'input[name="sapUserCreated"]:checked'
            ).value,
            sapUserCredential: state.sapUserCredentialInput.value,
            sapEnv: state.sapEnvInput.value,
            userRole: state.userRoleInput.value,
            hasApiMgmt: document.querySelector(
                'input[name="hasApiMgmt"]:checked'
            ).value,
            isCpi: document.querySelector('input[name="isCpi"]:checked').value,
            deltaId: document.getElementById("deltaId").value,
            apiProxy: document.getElementById("apiProxy").value,
            apiProduct: document.getElementById("apiProduct").value,
            apiApplication: document.getElementById("apiApplication").value,
            apiKvm: document.getElementById("apiKvm").value,

            images: {
                qas: getImageData(state.qasImageUpload),
                iflow: getImageData(state.iflowImageUpload),
                apiProxy: getImageData(
                    document
                        .getElementById("apiProxyPaste")
                        ?.closest(".form-img-upload")
                ),
                apiProduct: getImageData(
                    document
                        .getElementById("apiProductPaste")
                        ?.closest(".form-img-upload")
                ),
                apiApplication: getImageData(
                    document
                        .getElementById("apiApplicationPaste")
                        ?.closest(".form-img-upload")
                ),
                apiKvm: getImageData(
                    document
                        .getElementById("apiKvmPaste")
                        ?.closest(".form-img-upload")
                ),
            },

            configureData: {
                sender: [],
                receiver: [],
                more: [],
            },
        };

        document
            .querySelectorAll("#senderEntriesContainer .dynamic-entry")
            .forEach((entry) => {
                formData.configureData.sender.push({
                    image: getImageData(entry),
                    keyValues: collectKeyValues(entry),
                });
            });

        document
            .querySelectorAll("#receiverEntriesContainer .dynamic-entry")
            .forEach((entry) => {
                formData.configureData.receiver.push({
                    image: getImageData(entry),
                    keyValues: collectKeyValues(entry),
                });
            });

        document
            .querySelectorAll("#moreEntriesContainer .dynamic-entry")
            .forEach((entry) => {
                formData.configureData.more.push({
                    image: getImageData(entry),
                    keyValues: collectKeyValues(entry),
                });
            });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Documentação");
        const isPackageInQAS = state.qasRadios[0].checked;
        const hasApiManagement = state.apiMgmtYes.checked;

        if (isPackageInQAS && hasApiManagement) {
            await buildModel3(workbook, worksheet, formData);
        } else if (isPackageInQAS && !hasApiManagement) {
            await buildModel1(workbook, worksheet, formData);
        } else if (!isPackageInQAS && hasApiManagement) {
            await buildModel4(workbook, worksheet, formData);
        } else {
            await buildModel2(workbook, worksheet, formData);
        }

        const match1 = formData.iflowName.match(/T4AllBrasil_(.*?)_Out/);
        const iflow1 = match1 ? match1[1] : "PARTE1_NAO_ENCONTRADA";
        const match2 = formData.iflowName.match(/_In_(.*)/);
        const iflow2 = match2 ? match2[1] : "PARTE2_NAO_ENCONTRADA";
        const fileName = `TransporteObjetosBTP_${iflow1}_${formData.deltaId}_${iflow2}-QAS.xlsx`;

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Erro ao gerar a planilha:", error);
        alert("Ocorreu um erro ao gerar a planilha.");
    }
}
