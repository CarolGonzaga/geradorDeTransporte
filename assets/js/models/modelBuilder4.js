// assets/js/models/modelBuilder4.js

export async function buildModel4(workbook, worksheet, data) {
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
    worksheet.getColumn("F").width = 52.71; // COLUNA F ADICIONADA

    // --- ALTURA DAS LINHAS ---
    worksheet.getRow(10).height = 95; // Imagem "Não QAS"
    worksheet.getRow(14).height = 44; // Imagem iFlow
    [17, 20, 23, 26].forEach(
        (rowNum) => (worksheet.getRow(rowNum).height = 33)
    ); // Imagens API

    // --- CABEÇALHO ---
    worksheet.mergeCells("A1:F1"); // Mesclado até a coluna F
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
    worksheet.getCell("B9").value = data.packageName;
    worksheet.mergeCells("B10:C10");
    await addImageToSheet(data.images.qas, "B10:C10"); // CHAMADA CORRIGIDA

    // Seção 3 (iFlow e API Management)
    worksheet.getCell("A12").value = "3.";
    worksheet.getCell("B12").value = "iFlows / Value mapping / Api Management";
    worksheet.getCell("C12").value = "Objeto";
    worksheet.getCell("D12").value = "Pacote em que o iFlow se encontra";
    worksheet.getCell("B13").value = data.iflowName;
    worksheet.getCell("C13").value = "iFlow";
    worksheet.getCell("D13").value = data.packageName;
    worksheet.mergeCells("B14:D14");
    await addImageToSheet(data.images.iflow, "B14:D14"); // CHAMADA CORRIGIDA

    // Campos de API Management
    worksheet.getCell("C16").value = "Api Proxy";
    worksheet.getCell("B16").value = data.apiProxy;
    worksheet.mergeCells("B17:E17");
    await addImageToSheet(data.images.apiProxy, "B17:E17"); // CHAMADA CORRIGIDA

    worksheet.getCell("C19").value = "Product";
    worksheet.getCell("B19").value = data.apiProduct;
    worksheet.mergeCells("B20:E20");
    await addImageToSheet(data.images.apiProduct, "B20:E20"); // CHAMADA CORRIGIDA

    worksheet.getCell("C22").value = "Application";
    worksheet.getCell("B22").value = data.apiApplication;
    worksheet.mergeCells("B23:E23");
    await addImageToSheet(data.images.apiApplication, "B23:E23"); // CHAMADA CORRIGIDA

    worksheet.getCell("C25").value = "Key Value Maps";
    worksheet.getCell("B25").value = data.apiKvm;
    worksheet.mergeCells("B26:E26");
    await addImageToSheet(data.images.apiKvm, "B26:E26"); // CHAMADA CORRIGIDA

    // Seções Finais
    worksheet.getCell("A28").value = "4.";
    worksheet.getCell("B28").value = "Credencial a ser criada";
    worksheet.getCell("B29").value = "Usuario SAP foi criado? (sim / não)";
    worksheet.getCell("B30").value =
        "Usuário SAP para atribuição na credencial";
    worksheet.getCell("B31").value = "Ambiente SAP do usuário";
    worksheet.getCell("C29").value = data.sapUserCreated;
    worksheet.getCell("C30").value = data.sapUserCredential;
    worksheet.getCell("C31").value = data.sapEnv;

    worksheet.getCell("A33").value = "5.";
    worksheet.getCell("B33").value = "Role para a interface";
    worksheet.getCell("B34").value = "Criar role";
    worksheet.getCell("C34").value = data.userRole;
    worksheet.getCell("B35").value = "API management (sim ou não)";
    worksheet.getCell("C35").value = data.hasApiMgmt;
    worksheet.getCell("B36").value = "CPI (sim ou não)";
    worksheet.getCell("C36").value = data.isCpi;
    worksheet.getCell("B38").value =
        "Verificar credenciais BTP para chamadas externas? (sim / não)";
    worksheet.getCell("C38").value = "Sim";

    // --- SEÇÃO 6 (CONFIGURE) ---
    worksheet.getCell("A40").value = "6.";
    worksheet.getCell("B40").value = "Configure";
    let currentRow = 41; // LÓGICA ADICIONADA (iniciando na linha 41)
    const configureItems = [
        ...(data.configureData.sender ? [data.configureData.sender] : []),
        ...data.configureData.receiver,
        ...data.configureData.more,
    ];
    for (const item of configureItems) {
        const imageRange = `B${currentRow}:D${currentRow + 20}`;
        worksheet.mergeCells(imageRange);
        await addImageToSheet(item.image, imageRange);
        const textRow = currentRow + 8;
        worksheet.getCell(`E${textRow}`).value = item.name;
        worksheet.getCell(`F${textRow}`).value = item.value;
        worksheet.getCell(`E${textRow}`).style = boldStyle;
        currentRow += 22;
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
        "A28",
        "B28",
        "A33",
        "B33",
        "A40",
        "B40",
    ];
    cellsToMakeBold.forEach((cellId) => {
        worksheet.getCell(cellId).style = boldStyle;
    });
}
