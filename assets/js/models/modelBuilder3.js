export async function buildModel3(workbook, worksheet, data) {
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

    // --- LARGURA DAS COLUNAS (adicionando a coluna F) ---
    worksheet.getColumn("A").width = 3.71;
    worksheet.getColumn("B").width = 57.71;
    worksheet.getColumn("C").width = 30.71;
    worksheet.getColumn("D").width = 32.71;
    worksheet.getColumn("E").width = 9.71;
    worksheet.getColumn("F").width = 52.71;

    // --- ALTURA DAS LINHAS ---
    worksheet.getRow(13).height = 44;
    [16, 19, 22, 25].forEach(
        (rowNum) => (worksheet.getRow(rowNum).height = 33)
    );

    // --- CABEÇALHO ---
    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "Solicitação para o time SAP BTP";
    worksheet.getCell("A1").style = boldStyle;

    // --- PREENCHIMENTO DOS DADOS ---
    // Seções 1 e 2
    worksheet.getCell("A3").value = "1.";
    worksheet.getCell("B3").value = "Integration Suite";
    worksheet.getCell("B4").value = "Origem DEV";
    worksheet.getCell("B5").value = "Destino QAS";
    worksheet.getCell("A7").value = "2.";
    worksheet.getCell("B7").value = "Pacotes";
    worksheet.getCell("B8").value = "Nome dos pacotes a serem transportados";
    worksheet.getCell("B9").value = "N/A";

    // Seção 3 (iFlow e API Management)
    worksheet.getCell("A11").value = "3.";
    worksheet.getCell("B11").value = "iFlows / Value mapping / Api Management";
    worksheet.getCell("C11").value = "Objeto";
    worksheet.getCell("D11").value = "Pacote em que o iFlow se encontra";
    worksheet.getCell("B12").value = data.iflowName;
    worksheet.getCell("C12").value = "iFlow";
    worksheet.getCell("D12").value = data.packageName;
    worksheet.mergeCells("B13:D13");
    await addImageToSheet(data.images.iflow, "B13:D13");

    // Campos de API Management
    worksheet.getCell("C15").value = "Api Proxy";
    worksheet.getCell("B15").value = data.apiProxy;
    worksheet.mergeCells("B16:E16");
    await addImageToSheet(data.images.apiProxy, "B16:E16");

    worksheet.getCell("C18").value = "Product";
    worksheet.getCell("B18").value = data.apiProduct;
    worksheet.mergeCells("B19:E19");
    await addImageToSheet(data.images.apiProduct, "B19:E19");

    worksheet.getCell("C21").value = "Application";
    worksheet.getCell("B21").value = data.apiApplication;
    worksheet.mergeCells("B22:E22");
    await addImageToSheet(data.images.apiApplication, "B22:E22");

    worksheet.getCell("C24").value = "Key Value Maps";
    worksheet.getCell("B24").value = data.apiKvm;
    worksheet.mergeCells("B25:E25");
    await addImageToSheet(data.images.apiKvm, "B25:E25");

    // Seções deslocadas
    worksheet.getCell("A27").value = "4.";
    worksheet.getCell("B27").value = "Credencial a ser criada";
    worksheet.getCell("B28").value = "Usuario SAP foi criado? (sim / não)";
    worksheet.getCell("B29").value =
        "Usuário SAP para atribuição na credencial";
    worksheet.getCell("B30").value = "Ambiente SAP do usuário";
    worksheet.getCell("C28").value = data.sapUserCreated;
    worksheet.getCell("C29").value = data.sapUserCredential;
    worksheet.getCell("C30").value = data.sapEnv;

    worksheet.getCell("A32").value = "5.";
    worksheet.getCell("B32").value = "Role para a interface";
    worksheet.getCell("B33").value = "Criar role";
    worksheet.getCell("C33").value = data.userRole;
    worksheet.getCell("B34").value = "API management (sim ou não)";
    worksheet.getCell("C34").value = data.hasApiMgmt;
    worksheet.getCell("B35").value = "CPI (sim ou não)";
    worksheet.getCell("C35").value = data.isCpi;
    worksheet.getCell("B37").value =
        "Verificar credenciais BTP para chamadas externas? (sim / não)";
    worksheet.getCell("C37").value = "Sim";

    // --- SEÇÃO 6 (CONFIGURE) ---
    worksheet.getCell("A39").value = "6.";
    worksheet.getCell("B39").value = "Configure";
    let currentRow = 40; // Inicia na linha correta para este modelo
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
        "A27",
        "B27",
        "A32",
        "B32",
        "A39",
        "B39",
    ];
    cellsToMakeBold.forEach((cellId) => {
        worksheet.getCell(cellId).style = boldStyle;
    });
}
