import { state } from "../state.js";
import { toastEl } from "../elements/toast.js";
import { api } from "../api.js";
import { modal } from "../modals.js";

const toast = new bootstrap.Toast(toastEl.launchSuccess);
const el = {
    clientSelect: document.getElementById("clientSelect"),
    launchBtn: document.getElementById("launchBtn"),

    // Options
    optProfile: document.getElementById("optProfile"),
    optNoVr: document.getElementById("optNoVr"),
    optFpsEnabled: document.getElementById("optFpsEnabled"),
    optFps: document.getElementById("optFps"),
    optMidi: document.getElementById("optMidi"),
    optOscEnabled: document.getElementById("optOscEnabled"),
    optOscInPort: document.getElementById("optOscInPort"),
    optOscOutIp: document.getElementById("optOscOutIp"),
    optOscOutPort: document.getElementById("optOscOutPort"),
    optAffinity: document.getElementById("optAffinity"),
    optProcessPriority: document.getElementById("optProcessPriority"),
    optMainThreadPriority: document.getElementById("optMainThreadPriority"),
    optWatchWorlds: document.getElementById("optWatchWorlds"),
    optWatchAvatars: document.getElementById("optWatchAvatars"),
    optDebugGui: document.getElementById("optDebugGui"),
    optSdkLogLevels: document.getElementById("optSdkLogLevels"),
    optUdonDebugLogging: document.getElementById("optUdonDebugLogging"),
    optExtraArgs: document.getElementById("optExtraArgs"),
};


/* =====================
 * init
 * ===================== */
export function initLaunchInstance() {
    el.launchBtn.addEventListener("click", onLaunchConfirm);

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

export async function openLaunchModal() {
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

    modal.launchOptions.show();
}

async function onLaunchConfirm() {
    const clientId = el.clientSelect.value;
    const inst = state.targetInstanceForLaunch;
    if (!clientId || !inst) return;

    const body = buildLaunchOptions(inst);

    const res = await api.launchInstance(clientId, body);
    modal.launchOptions.hide();

    if (res.ok) {
        toast.show();
    }
}

function buildLaunchOptions(inst) {
    const options = {
        instance: inst,
    };

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
    if (el.optWatchWorlds.checked)
        options.watchWorlds = true;
    if (el.optWatchAvatars.checked)
        options.watchAvatars = true;
    if (el.optDebugGui.checked)
        options.debugGui = true;
    if (el.optSdkLogLevels.checked)
        options.sdkLogLevels = true;
    if (el.optUdonDebugLogging.checked)
        options.udonDebugLogging = true;

    const extra = el.optExtraArgs.value.trim();
    if (extra) {
        options.extraArgs = extra;
    }

    return options;
}

function buildOscOption() {
    if (!el.optOscEnabled.checked) {
        return null;
    }

    return {
        inPort: Number(el.optOscInPort.value),
        outIp: el.optOscOutIp.value,
        outPort: Number(el.optOscOutPort.value),
    };
}

function numOrNull(v) {
    return v === "" ? null : Number(v);
}
