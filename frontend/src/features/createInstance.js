import { state } from "../state.js";
import { toastEl } from "../elements/toast.js";
import { api } from "../api.js";
import { modal } from "../modals.js";
import { DEKAPU_WORLD_ID } from "../constants.js";
import { openLaunchModal } from "./launcher.js";
import { getLaunchUrl } from "../utils.js";

const copyToast = new bootstrap.Toast(toastEl.copySuccess);
const el = {
    // submit
    createBtn: document.getElementById("createInstanceBtn"),

    // instance name mode
    radios: document.querySelectorAll('input[name="instanceMode"]'),
    selectInput: document.getElementById("selectInput"),
    manualInput: document.getElementById("manualInput"),

    // options
    queueEnabled: document.getElementById("queueEnabled"),
    regionSelect: document.getElementById("regionSelect"),
    groupAccessTypeSelect: document.getElementById("groupAccessTypeSelect"),


    copyInstanceLinkBtn: document.getElementById("copyInstanceLinkBtn"),
    startInstanceBtn: document.getElementById("startInstanceBtn"),
};

export function initCreateInstance() {
    el.createBtn.addEventListener("click", onCreateInstance);
    el.copyInstanceLinkBtn.addEventListener("click", onCopyLink);
    el.startInstanceBtn.addEventListener("click", onStartInstance)

    el.radios.forEach(radio => {
        radio.addEventListener("change", () => {
            el.selectInput.disabled = radio.value !== "select";
            el.manualInput.disabled = radio.value !== "manual";
        });
    });
}

async function onCreateInstance() {
    const mode = document.querySelector(
        'input[name="instanceMode"]:checked'
    ).value;

    let displayName = null;

    if (mode === "select") {
        displayName = el.selectInput.value;
    }

    if (mode === "manual") {
        const name = el.manualInput.value.trim();
        if (!name) {
            alert("名前が入力されていません");
            return;
        }
        displayName = name;
    }

    if (displayName) {
        displayName += "_" + formatNow();
    }

    const created = await api.createInstance({
        worldId: DEKAPU_WORLD_ID,
        type: "group",
        region: el.regionSelect.value,
        ownerId: state.selectedGroupId,
        groupAccessType: el.groupAccessTypeSelect.value,
        displayName: displayName,
        queueEnabled: el.queueEnabled.checked,
    });

    state.targetInstanceForLaunch = created;

    modal.createInstance.hide();
    modal.createComplete.show();
}

async function onCopyLink() {
    const inst = state.targetInstanceForLaunch;
    if (!inst) return;

    const url = getLaunchUrl(inst)
    await navigator.clipboard.writeText(url);
    copyToast.show();
}

async function onStartInstance() {
    const inst = state.targetInstanceForLaunch;
    if (!inst) return;

    modal.createComplete.hide();
    openLaunchModal()
}

function formatNow() {
    const n = new Date();
    const pad = v => String(v).padStart(2, "0");
    return (
        n.getFullYear() +
        pad(n.getMonth() + 1) +
        pad(n.getDate()) +
        "_" +
        pad(n.getHours()) +
        pad(n.getMinutes()) +
        pad(n.getSeconds())
    );
}
