import { Toast } from "bootstrap";
import { api } from "../api/api.js";
import { toastEl } from "../elements/toast.js";
import { modal } from "../modals.js";
import { getEl } from "../utils.js";
import type { LaunchOptions } from "../types/control.js";
import type { InstanceInfo } from "../types/instance.js";

const toast = new Toast(toastEl.launchSuccess);

const el = {
    clientSelect: getEl<HTMLSelectElement>("clientSelect"),
    launchBtn: getEl<HTMLButtonElement>("launchBtn"),

    optProfile: getEl<HTMLInputElement>("optProfile"),
    optNoVr: getEl<HTMLInputElement>("optNoVr"),
    optFpsEnabled: getEl<HTMLInputElement>("optFpsEnabled"),
    optFps: getEl<HTMLInputElement>("optFps"),
    optMidi: getEl<HTMLInputElement>("optMidi"),
    optOscEnabled: getEl<HTMLInputElement>("optOscEnabled"),
    optOscInPort: getEl<HTMLInputElement>("optOscInPort"),
    optOscOutIp: getEl<HTMLInputElement>("optOscOutIp"),
    optOscOutPort: getEl<HTMLInputElement>("optOscOutPort"),
    optAffinity: getEl<HTMLInputElement>("optAffinity"),
    optProcessPriority: getEl<HTMLSelectElement>("optProcessPriority"),
    optMainThreadPriority: getEl<HTMLSelectElement>("optMainThreadPriority"),
    optWatchWorlds: getEl<HTMLInputElement>("optWatchWorlds"),
    optWatchAvatars: getEl<HTMLInputElement>("optWatchAvatars"),
    optDebugGui: getEl<HTMLInputElement>("optDebugGui"),
    optSdkLogLevels: getEl<HTMLInputElement>("optSdkLogLevels"),
    optUdonDebugLogging: getEl<HTMLInputElement>("optUdonDebugLogging"),
    optExtraArgs: getEl<HTMLInputElement>("optExtraArgs"),
};

/* =====================
 * init
 * ===================== */
export function initLaunchInstance() {
    // FPS
    el.optFpsEnabled.addEventListener("change", () => {
        el.optFps.disabled = !el.optFpsEnabled.checked;
    });

    // OSC
    el.optOscEnabled.addEventListener("change", () => {
        const enabled = el.optOscEnabled.checked;
        el.optOscInPort.disabled = !enabled;
        el.optOscOutIp.disabled = !enabled;
        el.optOscOutPort.disabled = !enabled;
    });
}

export async function openLaunchModal(inst: InstanceInfo) {
    const clients = await api.fetchClients();

    el.clientSelect.innerHTML = "";

    clients.forEach(client => {
        const opt = document.createElement("option");
        opt.value = client.id;
        opt.textContent = client.description
            ? `${client.description} (${client.hostName})`
            : client.hostName;
        el.clientSelect.appendChild(opt);
    });

    el.launchBtn.onclick = () => onLaunchConfirm(inst);
    modal.launchOptions.show();
}

async function onLaunchConfirm(inst: InstanceInfo) {
    const id = el.clientSelect.value;
    if (!id) return;

    const options = buildLaunchOptions(inst);

    await api.launchInstance(id, options);
    modal.launchOptions.hide();
    toast.show();
}

function buildLaunchOptions(inst: InstanceInfo): LaunchOptions {
    const options: LaunchOptions = { instance: inst };

    const profile = numOrNull(el.optProfile.value);
    if (profile !== null && profile !== 0) {
        options.profile = profile;
    }

    if (el.optNoVr.checked) {
        options.noVr = true;
    }

    if (el.optFpsEnabled.checked) {
        const fps = numOrNull(el.optFps.value);
        if (fps !== null) {
            options.fps = fps;
        }
    }

    if (el.optMidi.value) {
        options.midi = el.optMidi.value;
    }

    const osc = buildOscOption();
    if (osc) {
        options.osc = osc;
    }

    if (el.optAffinity.value) {
        options.affinity = el.optAffinity.value;
    }

    const processPriority = Number(el.optProcessPriority.value);
    if (processPriority !== null && processPriority !== 0) {
        options.processPriority = processPriority;
    }

    const mainThreadPriority = Number(el.optMainThreadPriority.value);
    if (mainThreadPriority !== null && mainThreadPriority !== 0) {
        options.mainThreadPriority = mainThreadPriority;
    }

    // Extra options
    if (el.optWatchWorlds.checked) options.watchWorlds = true;
    if (el.optWatchAvatars.checked) options.watchAvatars = true;
    if (el.optDebugGui.checked) options.debugGui = true;
    if (el.optSdkLogLevels.checked) options.sdkLogLevels = true;
    if (el.optUdonDebugLogging.checked) options.udonDebugLogging = true;

    const extra = el.optExtraArgs.value.trim();
    if (extra) options.extraArgs = extra;


    return options;
}

function buildOscOption(): LaunchOptions["osc"] | null {
    if (!el.optOscEnabled.checked) return null;

    return {
        inPort: Number(el.optOscInPort.value),
        outIp: el.optOscOutIp.value,
        outPort: Number(el.optOscOutPort.value),
    };
}

function numOrNull(v: string): number | null {
    return v === "" ? null : Number(v);
}
