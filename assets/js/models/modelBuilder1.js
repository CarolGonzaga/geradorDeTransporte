export async function buildModel1(workbook, worksheet, data) {
    // Função auxiliar padrão, limpa e funcional
    async function addImageToSheet(imageData, range) {
        if (imageData && imageData.base64 && imageData.extension) {
            try {
                const imageId = workbook.addImage({
                    base64: imageData.base64,
                    extension: imageData.extension,
                });
                worksheet.addImage(imageId, range);
            } catch (e) {
                console.error(
                    "A biblioteca ExcelJS falhou ao tentar adicionar a imagem.",
                    e
                );
            }
        }
    }

    const boldStyle = {
        font: { bold: true },
        alignment: { vertical: "middle" },
    };
    worksheet.getColumn("A").width = 3.71;
    worksheet.getColumn("B").width = 57.71;
    worksheet.getColumn("C").width = 30.71;
    worksheet.getColumn("D").width = 32.71;
    worksheet.getColumn("E").width = 12.71;
    worksheet.getColumn("F").width = 52.71;
    worksheet.getRow(13).height = 44;

    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "Solicitação para o time SAP BTP";
    worksheet.getCell("A1").style = boldStyle;

    worksheet.getCell("A3").value = "1.";
    worksheet.getCell("B3").value = "Integration Suite";
    worksheet.getCell("B4").value = "Origem DEV";
    worksheet.getCell("B5").value = "Destino QAS";
    worksheet.getCell("A7").value = "2.";
    worksheet.getCell("B7").value = "Pacotes";
    worksheet.getCell("B8").value = "Nome dos pacotes a serem transportados";
    worksheet.getCell("B9").value = "N/A";
    worksheet.getCell("A11").value = "3.";
    worksheet.getCell("B11").value = "iFlows / Value mapping";
    worksheet.getCell("C11").value = "Objeto";
    worksheet.getCell("D11").value = "Pacote em que o iFlow se encontra";
    worksheet.getCell("B12").value = data.iflowName;
    worksheet.getCell("C12").value = "iFlow";
    worksheet.getCell("D12").value = data.packageName;
    worksheet.mergeCells("B13:D13");
    await addImageToSheet(data.images.iflow, "B13:D13");

    worksheet.getCell("A15").value = "4.";
    worksheet.getCell("B15").value = "Credencial a ser criada";
    worksheet.getCell("B16").value = "Usuario SAP foi criado? (sim / não)";
    worksheet.getCell("B17").value =
        "Usuário SAP para atribuição na credencial";
    worksheet.getCell("B18").value = "Ambiente SAP do usuário";
    worksheet.getCell("C16").value = data.sapUserCreated;
    worksheet.getCell("C17").value = data.sapUserCredential;
    worksheet.getCell("C18").value = data.sapEnv;
    worksheet.getCell("A20").value = "5.";
    worksheet.getCell("B20").value = "Role para a interface";
    worksheet.getCell("B21").value = "Criar role";
    worksheet.getCell("C21").value = data.userRole;
    worksheet.getCell("B22").value = "API management (sim ou não)";
    worksheet.getCell("C22").value = data.hasApiMgmt;
    worksheet.getCell("B23").value = "CPI (sim ou não)";
    worksheet.getCell("C23").value = data.isCpi;
    worksheet.getCell("B25").value =
        "Verificar credenciais BTP para chamadas externas? (sim / não)";
    worksheet.getCell("C25").value = "Sim";

    // --- SEÇÃO 6 (CONFIGURE) ---
    worksheet.getCell("A27").value = "6.";
    worksheet.getCell("B27").value = "Configure";
    let currentRow = 28;
    const configureItems = [
        ...data.configureData.sender,
        ...data.configureData.receiver,
        ...data.configureData.more,
    ];

    // --- LÓGICA DO LOOP PRINCIPAL ATUALIZADA ---
    for (const item of configureItems) {
        // Adiciona a imagem, reservando 21 linhas de altura
        const imageRange = `B${currentRow}:D${currentRow + 20}`;
        worksheet.mergeCells(imageRange);
        await addImageToSheet(item.image, imageRange);

        // Define a linha inicial para o primeiro par de chave/valor
        let textRow = currentRow + 8;

        // Loop interno para adicionar todos os pares de chave/valor
        if (item.keyValues && item.keyValues.length > 0) {
            item.keyValues.forEach((kvPair, index) => {
                const keyCell = worksheet.getCell(`E${textRow}`);
                keyCell.value = kvPair.name;
                worksheet.getCell(`F${textRow}`).value = kvPair.value;

                // Coloca apenas a primeira chave em negrito
                if (index === 0) {
                    keyCell.style = boldStyle;
                }
                textRow++; // Incrementa a linha para o próximo par
            });
        }

        // Calcula a próxima linha de início de forma dinâmica.
        // Ele pega o maior valor entre o espaço fixo da imagem (22 linhas)
        // e a posição da última linha de texto, garantindo que não haja sobreposição.
        const nextImageStartsAt = Math.max(currentRow + 22, textRow);
        currentRow = nextImageStartsAt;
    }

    // --- APLICAR ESTILO DE NEGRIto ONDE NECESSÁRIO ---
    const cellsToMakeBold = [
        "A3",
        "B3",
        "A7",
        "B7",
        "A11",
        "B11",
        "C11",
        "D11",
        "A15",
        "B15",
        "A20",
        "B20",
        "A27",
        "B27",
    ];
    cellsToMakeBold.forEach((cellId) => {
        worksheet.getCell(cellId).style = boldStyle;
    });
}
