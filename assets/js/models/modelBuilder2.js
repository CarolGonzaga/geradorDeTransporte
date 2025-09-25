export async function buildModel2(workbook, worksheet, data) {
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
    worksheet.getRow(10).height = 95;
    worksheet.getRow(14).height = 44;

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
    worksheet.getCell("B9").value = data.packageName;
    worksheet.mergeCells("B10:C10");
    await addImageToSheet(data.images.qas, "B10:C10");

    worksheet.getCell("A12").value = "3.";
    worksheet.getCell("B12").value = "iFlows / Value mapping";
    worksheet.getCell("C12").value = "Objeto";
    worksheet.getCell("D12").value = "Pacote em que o iFlow se encontra";
    worksheet.getCell("B13").value = data.iflowName;
    worksheet.getCell("C13").value = "iFlow";
    worksheet.getCell("D13").value = data.packageName;
    worksheet.mergeCells("B14:D14");
    await addImageToSheet(data.images.iflow, "B14:D14");

    worksheet.getCell("A16").value = "4.";
    worksheet.getCell("B16").value = "Credencial a ser criada";
    worksheet.getCell("B17").value = "Usuario SAP foi criado? (sim / não)";
    worksheet.getCell("B18").value =
        "Usuário SAP para atribuição na credencial";
    worksheet.getCell("B19").value = "Ambiente SAP do usuário";
    worksheet.getCell("C17").value = data.sapUserCreated;
    worksheet.getCell("C18").value = data.sapUserCredential;
    worksheet.getCell("C19").value = data.sapEnv;
    worksheet.getCell("A21").value = "5.";
    worksheet.getCell("B21").value = "Role para a interface";
    worksheet.getCell("B22").value = "Criar role";
    worksheet.getCell("C22").value = data.userRole;
    worksheet.getCell("B23").value = "API management (sim ou não)";
    worksheet.getCell("C23").value = data.hasApiMgmt;
    worksheet.getCell("B24").value = "CPI (sim ou não)";
    worksheet.getCell("C24").value = data.isCpi;
    worksheet.getCell("B26").value =
        "Verificar credenciais BTP para chamadas externas? (sim / não)";
    worksheet.getCell("C26").value = "Sim";

    // --- SEÇÃO 6 (CONFIGURE) ---
    worksheet.getCell("A28").value = "6.";
    worksheet.getCell("B28").value = "Configure";
    let currentRow = 29; // Inicia na linha correta para este modelo
    const configureItems = [
        ...data.configureData.sender,
        ...data.configureData.receiver,
        ...data.configureData.more,
    ];

    // --- LÓGICA DO LOOP PRINCIPAL ATUALIZADA ---
    for (const item of configureItems) {
        const imageRange = `B${currentRow}:D${currentRow + 20}`;
        worksheet.mergeCells(imageRange);
        await addImageToSheet(item.image, imageRange);

        let textRow = currentRow + 8;

        if (item.keyValues && item.keyValues.length > 0) {
            item.keyValues.forEach((kvPair, index) => {
                const keyCell = worksheet.getCell(`E${textRow}`);
                keyCell.value = kvPair.name;
                worksheet.getCell(`F${textRow}`).value = kvPair.value;

                if (index === 0) {
                    keyCell.style = boldStyle;
                }
                textRow++;
            });
        }

        const nextImageStartsAt = Math.max(currentRow + 22, textRow);
        currentRow = nextImageStartsAt;
    }

    const cellsToMakeBold = [
        "A3",
        "B3",
        "A7",
        "B7",
        "A12",
        "B12",
        "C12",
        "D12",
        "A16",
        "B16",
        "A21",
        "B21",
        "A28",
        "B28",
    ];
    cellsToMakeBold.forEach((cellId) => {
        worksheet.getCell(cellId).style = boldStyle;
    });
}
