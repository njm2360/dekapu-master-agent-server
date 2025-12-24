import { state } from "../state";
import { modal } from "../modals";
import { api } from "../api/api";
import { toastEl } from "../elements/toast";
import { DEKAPU_WORLD_ID } from "../constants";
import { openLaunchModal } from "./launcher";
import { formatDate, getEl, getLaunchUrl } from "../utils";
import { InstanceType, type InstanceInfo, type Region } from "../types/instance";
import type { GroupAccessType } from "../types/group";

import { Toast } from "bootstrap";

const copyToast = new Toast(toastEl.copySuccess);

const el = {
    // submit
    createBtn: getEl<HTMLButtonElement>("createInstanceBtn"),

    // instance name mode
    radios: document.querySelectorAll<HTMLInputElement>(
        'input[name="instanceMode"]'
    ),

    selectInput: getEl<HTMLInputElement>("selectInput"),
    manualInput: getEl<HTMLInputElement>("manualInput"),

    // options
    queueEnabled: getEl<HTMLInputElement>("queueEnabled"),
    regionSelect: getEl<HTMLInputElement>("regionSelect"),
    groupAccessTypeSelect: getEl<HTMLInputElement>("groupAccessTypeSelect"),

    copyInstanceLinkBtn: getEl<HTMLButtonElement>("copyInstanceLinkBtn"),
    startInstanceBtn: getEl<HTMLButtonElement>("startInstanceBtn"),

    // roles
    leftRoleList: getEl<HTMLSelectElement>("leftRoleList"),
    rightRoleList: getEl<HTMLSelectElement>("rightRoleList"),

    moveRightBtn: getEl<HTMLButtonElement>("moveRightBtn"),
    moveAllRightBtn: getEl<HTMLButtonElement>("moveAllRightBtn"),
    moveLeftBtn: getEl<HTMLButtonElement>("moveLeftBtn"),
    moveAllLeftBtn: getEl<HTMLButtonElement>("moveAllLeftBtn"),
    accordionEl: getEl<HTMLButtonElement>("roleAccordionCollapse")
};

export function initCreateInstance() {
    el.createBtn.addEventListener("click", onCreateInstance);

    el.radios.forEach(radio => {
        radio.addEventListener("change", () => {
            el.selectInput.disabled = radio.value !== "select";
            el.manualInput.disabled = radio.value !== "manual";
        });
    });

    el.moveRightBtn.onclick = () =>
        moveSelected(el.leftRoleList, el.rightRoleList);
    el.moveAllRightBtn.onclick = () =>
        moveAll(el.leftRoleList, el.rightRoleList);
    el.moveLeftBtn.onclick = () =>
        moveSelected(el.rightRoleList, el.leftRoleList);
    el.moveAllLeftBtn.onclick = () =>
        moveAll(el.rightRoleList, el.leftRoleList);

    el.accordionEl.addEventListener("shown.bs.collapse", async () => {
        await loadGroupRoles(state.selectedGroupId!);
    });
}

async function onCreateInstance() {
    const modeEl = document.querySelector<HTMLInputElement>(
        'input[name="instanceMode"]:checked'
    );

    if (!modeEl || !state.selectedGroupId) return;

    const mode = modeEl.value as "select" | "manual";

    let displayName: string | undefined;

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

    const selectedRoleIds = Array.from(el.rightRoleList.options).map(
        opt => opt.value
    );

    const created = await api.createInstance({
        worldId: DEKAPU_WORLD_ID,
        type: InstanceType.GROUP,
        region: el.regionSelect.value as Region,
        ownerId: state.selectedGroupId,
        groupAccessType: el.groupAccessTypeSelect.value as GroupAccessType,
        queueEnabled: el.queueEnabled.checked,
        ...(displayName ? { displayName: `${displayName}_${formatDate(new Date())}` } : {}),
        ...(selectedRoleIds.length > 0
            ? { roleIds: selectedRoleIds }
            : {}),
    });

    modal.createInstance.hide();
    openCreateCompleteModal(created)
}

function openCreateCompleteModal(inst: InstanceInfo) {
    modal.createComplete.show();

    el.copyInstanceLinkBtn.onclick = async () => {
        await copyLink(inst);
    };

    el.startInstanceBtn.onclick = () => {
        modal.createComplete.hide();
        openLaunchModal(inst);
    };
}

async function copyLink(inst: InstanceInfo) {
    const url = getLaunchUrl(inst)
    await navigator.clipboard.writeText(url);
    copyToast.show();
}

export async function loadGroupRoles(groupId: string) {
    const roles = await api.fetchGroupRoles(groupId);

    el.leftRoleList.innerHTML = "";

    roles.forEach((role) => {
        const option = document.createElement("option");
        option.value = role.id;
        option.textContent = role.name;
        option.title = role.description;
        el.leftRoleList.appendChild(option);
    });
}

function moveSelected(from: HTMLSelectElement, to: HTMLSelectElement) {
    Array.from(from.selectedOptions).forEach(opt => {
        to.appendChild(opt);
    });
}

function moveAll(from: HTMLSelectElement, to: HTMLSelectElement) {
    Array.from(from.options).forEach(opt => {
        to.appendChild(opt);
    });
}
