import { state } from "../state";
import { api } from "../api/api";
import { modal } from "../modals";
import { loadGroupInstances } from "./instanceTable";
import { getDisplayName, getEl } from "../utils";
import type { InstanceInfo } from "../types/instance";

const el = {
    closeInstanceName: getEl<HTMLSpanElement>("closeInstanceName"),
    confirmCloseBtn: getEl<HTMLButtonElement>("confirmCloseBtn"),
};

export function openCloseModal(inst: InstanceInfo) {
    el.closeInstanceName.textContent = getDisplayName(inst);
    el.confirmCloseBtn.addEventListener("click", async () => {
        await onCloseConfirm(inst)
    });
    modal.closeConfirm.show();
}

async function onCloseConfirm(inst: InstanceInfo) {
    const groupId = state.selectedGroupId;
    if (!groupId) return;

    await api.closeInstance(inst);
    modal.closeConfirm.hide();
    await loadGroupInstances(groupId);
}
