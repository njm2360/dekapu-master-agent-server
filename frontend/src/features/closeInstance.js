import { state } from "../state.js";
import { api } from "../api.js";
import { modal } from "../modals.js";
import { loadGroupInstances } from "./instanceTable.js";
import { getDisplayName } from "../utils.js";

const el = {
    closeInstanceName: document.getElementById("closeInstanceName"),
    confirmCloseBtn: document.getElementById("confirmCloseBtn"),
};

export function initCloseInstance() {
    el.confirmCloseBtn.addEventListener("click", onCloseConfirm);
}

export function requestClose(inst) {
    state.targetInstanceForClose = inst;
    el.closeInstanceName.textContent = getDisplayName(inst);
    modal.closeConfirm.show();
}

async function onCloseConfirm() {
    const inst = state.targetInstanceForClose;
    if (!inst) return;

    await api.closeInstance(inst);
    modal.closeConfirm.hide();
    await loadGroupInstances();
}
