import { GROUP_MAP } from "./constants";
import { initCreateInstance } from "./features/createInstance";
import { forceReloadGroupInstances, initInstanceTable, loadGroupInstances } from "./features/instanceTable";
import { initLaunchInstance } from "./features/launcher";
import { state } from "./state";
import { modal } from "./modals";
import { pageEl as el } from "./elements/page";

import './scss/styles.scss'

document.addEventListener("DOMContentLoaded", () => {
    initInstanceTable(() => {
        const groupId = state.selectedGroupId;
        if (groupId) void forceReloadGroupInstances(groupId);
    });
    initCreateInstance();
    initLaunchInstance();

    el.openCreateModalBtn.addEventListener("click", () => {
        modal.createInstance.show();
    });

    el.groupSelect.innerHTML = "";

    GROUP_MAP.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = g.name;
        el.groupSelect.appendChild(opt);
    });

    el.groupSelect.addEventListener("change", async () => {
        const groupId = el.groupSelect.value;
        state.selectedGroupId = groupId;;
        await loadGroupInstances(groupId);
    });

    state.selectedGroupId = el.groupSelect.value;
    void loadGroupInstances(state.selectedGroupId);
});
