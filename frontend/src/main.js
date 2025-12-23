import { initCreateInstance } from "./features/createInstance.js";
import { initCloseInstance } from "./features/closeInstance.js";
import { initLaunchInstance } from "./features/launcher.js";
import { initInstanceTable } from "./features/instanceTable.js";

import { modal } from "./modals.js";
import { state } from "./state.js";
import { GROUP_MAP } from "./constants.js";
import { pageEl as el } from "./elements/page.js";
import { loadGroupInstances } from "./features/instanceTable.js";

document.addEventListener("DOMContentLoaded", () => {
    initInstanceTable();
    initCreateInstance();
    initCloseInstance()
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
        state.selectedGroupId = el.groupSelect.value;
        await loadGroupInstances();
    });

    state.selectedGroupId = el.groupSelect.value;
    loadGroupInstances();
});
