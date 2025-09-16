// assets/js/state.js (COMPLETO E CORRIGIDO)

// --- Seletores de Elementos do DOM ---
export const form = document.getElementById("docForm");
export const generateButton = document.getElementById("generateButton");
export const clearFormButton = document.getElementById("clearForm");
export const tabLinks = document.querySelectorAll(".tab-link");
export const tabPanes = document.querySelectorAll(".tab-pane");
export const apiMgmtRadios = document.querySelectorAll(
    'input[name="hasApiMgmt"]'
);
export const apiMgmtDetails = document.getElementById("apiMgmtDetails");
export const qasImageUpload = document.getElementById("qasImageUpload");
export const iflowImageUpload = document.getElementById("iflowImageUpload");
export const apiMgmtYes = document.getElementById("apiMgmtYes");
export const apiMgmtNo = document.getElementById("apiMgmtNo");
export const eventMeshRadios = document.querySelectorAll(
    'input[name="isEventMesh"]'
);
export const packageNameInput = document.getElementById("packageName");
export const iflowNameInput = document.getElementById("iflowName");
export const sapUserCredentialInput =
    document.getElementById("sapUserCredential");
export const sapEnvInput = document.getElementById("sapEnv");
export const userRoleInput = document.getElementById("userRole");
export const sapUserNA = document.getElementById("sapUserNA");
export const sapEnvNA = document.getElementById("sapEnvNA");
export const userRoleNA = document.getElementById("userRoleNA");
export const apiPopup = document.getElementById("api-popup");
export const qasRadios = document.querySelectorAll('input[name="inQAS"]');

const encodedUserRoleMap =
    "ewogICAgIlM0Q1BHX0FEUCI6ICJFU0JNZXNzYWdpbmcuUzRDUEdfQURQIiwKICAgICJTNENQR19FVk9MVVRJTyI6ICJFU0JNZXNzYWdpbmcuUzRDUEdfRVZPTFVUSU8iLAogICAgIlM0Q1BHX0dUQSI6ICJFU0JNZXNzYWdpbmcuUzRDUEdfR1RBIiwKICAgICJTNENQR19LTkFQUCI6ICJFU0JNZXNzYWdpbmcuUzRDUEdfS05BUFAiLAogICAgIlM0Q1BHX0xJTVMiOiAiRVNCTWVzc2FnaW5nLlM0Q1BHX0xJTVMiLAogICAgIlM0Q1BHX01BTkhBVFRBTiI6ICJFU0JNZXNzYWdpbmcuUzRDUEdfTUFOSEFUVEFOIiwKICAgICJTNENQR19ORVhYRVJBIjogIkVTQk1lc3NhZ2luZy5TNENQR19ORVhYRVJBIiwKICAgICJTNENQR19POSI6ICJFU0JNZXNzYWdpbmcuUzRDUEdfTzkiLAogICAgIlM0Q1BHX09UTSI6ICJFU0JNZXNzYWdpbmcuUzRDUEdfT1RNIiwKICAgICJTNENQR19QQkNTIjogIkVTQk1lc3NhZ2luZy5TNENQR19QQkNTIiwKICAgICJTNENQR19QTEFOVFNVSVRFIjogIkVTQk1lc3NhZ2luZy5TNENQR19QTEFOVFNVSVRFIiwKICAgICJTNENQR19UUkFOU1BPUlRBRE9SQVMiOiAiRVNCTWVzc2FnaW5nLlM0Q1BHX1RSQU5TUE9SVEFET1JBUyIsCiAgICAiUzRDUEdfV0VCTkVTVEEiOiAiRVNCTWVzc2FnaW5nLlM0Q1BHX1dFQk5FU1RBIiwKICAgICJTNENQR19XT1JLREFZIjogIkVTQk1lc3NhZ2luZy5TNENQR19XT1JLREFZIiwKICAgICJTQVBFQ0NfU0FQUzRIQU5BIjogIkVTQk1lc3NhZ2luZy5TQVBFQ0NfU0FQUzRIQU5BIiwKICAgICJTNENQR19BUklCQSI6ICJFU0JNZXNzYWdpbmcuUzRDUEdfQVJJQkEiCn0=";
// --- Constantes e Mapas de Dados ---
export const userRoleMap = JSON.parse(atob(encodedUserRoleMap));
export const apiKeywords = ["MANHATTAN", "ADDTAX", "OTM", "PBCS", "PLM"];

// --- Seletores da Aba Configure ---
export const senderSection = document.getElementById("senderSection");
export const senderExternalizationValue = document.getElementById(
    "senderExternalizationValue"
);
export const receiverRadios = document.querySelectorAll(
    'input[name="hasReceiverExternalization"]'
);
export const receiverEntriesContainer = document.getElementById(
    "receiverEntriesContainer"
);
export const addReceiverEntryBtn = document.getElementById("addReceiverEntry");
export const moreRadios = document.querySelectorAll(
    'input[name="hasMoreExternalization"]'
);
export const moreEntriesContainer = document.getElementById(
    "moreEntriesContainer"
);
export const addMoreEntryBtn = document.getElementById("addMoreEntry");

export const senderRadios = document.querySelectorAll(
    'input[name="hasSenderExternalization"]'
);
