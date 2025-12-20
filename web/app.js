// =====================
// state
// =====================
const state = {
    selectedGroupId: null,
    targetInstanceForLaunch: null,
    targetInstanceForClose: null,

    instanceCache: {}, // { [groupId]: { instances, fetchedAt } }
};

const GROUP_MAP = [
    { id: "grp_f664b62c-df1a-4ad4-a1df-2b9df679bc04", name: "スキルブッパ連合" },
    { id: "grp_746f4574-b608-41d3-baed-03fa906391d5", name: "スキルブッパ会" },
]

const DEKAPU_WORLD_ID = "wrld_1af53798-92a3-4c3f-99ae-a7c42ec6084d"

const EXTRA_ARGS = ["--process-priority=2", "--main-thread-priority=2"]

// =====================
// elements
// =====================
const el = {
    groupSelect: document.getElementById("groupSelect"),
    tableBody: document.getElementById("instanceTableBody"),

    radios: document.querySelectorAll('input[name="instanceMode"]'),
    selectInput: document.getElementById("selectInput"),
    manualInput: document.getElementById("manualInput"),
    queueEnabled: document.getElementById("queueEnabled"),
    regionSelect: document.getElementById("regionSelect"),
    groupAccessTypeSelect: document.getElementById("groupAccessTypeSelect"),

    openCreateModalBtn: document.getElementById("openCreateModalBtn"),
    createBtn: document.getElementById("createInstanceBtn"),
    refreshBtn: document.getElementById("refreshBtn"),
    lastUpdated: document.getElementById("lastUpdated"),

    clientSelect: document.getElementById("clientSelect"),
    launchBtn: document.getElementById("launchBtn"),

    closeInstanceName: document.getElementById("closeInstanceName"),
    confirmCloseBtn: document.getElementById("confirmCloseBtn"),
};

// =====================
// modals
// =====================
const modal = {
    client: new bootstrap.Modal(document.getElementById("clientModal")),
    closeConfirm: new bootstrap.Modal(document.getElementById("closeConfirmModal")),
    createInstance: new bootstrap.Modal(document.getElementById("createInstanceModal")),
};

// =====================
// api
// =====================
const api = {
    async fetchGroupInstances(groupId) {
        const res = await fetch(`/api/groups/${groupId}/instances`);
        return res.json();
    },

    async fetchInstanceDetail(item) {
        const res = await fetch(
            `/api/instances/${item.world.id}:${item.instanceId}`
        );
        return res.json();
    },

    async fetchClients() {
        const res = await fetch("/api/control/clients");
        return res.json();
    },

    async launchInstance(id, body) {
        await fetch(`/api/control/${id}/launch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    },

    async closeInstance(inst) {
        await fetch(
            `/api/instances/${inst.worldId}:${inst.instanceId}`,
            { method: "DELETE" }
        );
    },

    async createInstance(body) {
        const res = await fetch("/api/instances/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status !== 200) throw new Error();
        return res.json();
    },
};

// =====================
// init
// =====================
initGroupSelect();
initRadioControl();
initButtons();

// =====================
// init functions
// =====================
function initGroupSelect() {
    el.groupSelect.innerHTML = "";

    GROUP_MAP.forEach(group => {
        const opt = document.createElement("option");
        opt.value = group.id;
        opt.textContent = group.name;
        el.groupSelect.appendChild(opt);
    });

    el.groupSelect.addEventListener("change", async () => {
        state.selectedGroupId = el.groupSelect.value;
        await loadGroupInstances();
    });

    state.selectedGroupId = el.groupSelect.value;
    loadGroupInstances();
}

function initRadioControl() {
    el.radios.forEach(radio => {
        radio.addEventListener("change", () => {
            el.selectInput.disabled = radio.value !== "select";
            el.manualInput.disabled = radio.value !== "manual";
        });
    });
}

function initButtons() {
    el.openCreateModalBtn.addEventListener("click", () => {
        modal.createInstance.show();
    });

    el.launchBtn.addEventListener("click", onLaunchConfirm);
    el.confirmCloseBtn.addEventListener("click", onCloseConfirm);
    el.createBtn.addEventListener("click", onCreateInstance);

    el.refreshBtn.addEventListener("click", () => {
        forceReloadGroupInstances();
    });
}


function getInstanceDisplayName(instance) {
    return instance.displayName || instance.name || "";
}

// =====================
// load & render
// =====================
async function loadGroupInstances() {
    const groupId = state.selectedGroupId;
    if (!groupId) return;
    renderLastUpdated(null);

    const cache = state.instanceCache[groupId];
    if (cache) {
        renderInstanceTable(cache.instances);
        renderLastUpdated(cache.fetchedAt);
        return;
    }

    await forceReloadGroupInstances();
}

async function forceReloadGroupInstances() {
    renderLoading();
    renderLastUpdated(null);

    try {
        const list = await api.fetchGroupInstances(state.selectedGroupId);
        const details = await Promise.all(
            list.map(item => api.fetchInstanceDetail(item))
        );

        const fetchedAt = new Date();

        state.instanceCache[state.selectedGroupId] = {
            instances: details,
            fetchedAt,
        };

        renderInstanceTable(details);
        renderLastUpdated(fetchedAt);
    } catch {
        renderError();
        renderLastUpdated(null);
    }
}

function renderLastUpdated(date) {
    if (!date) {
        el.lastUpdated.textContent = "未取得";
        return;
    }

    el.lastUpdated.textContent = date.toLocaleString();
}

function renderLoading() {
    el.tableBody.innerHTML = `
    <tr>
      <td colspan="4" class="text-center text-muted">読み込み中...</td>
    </tr>
  `;
}

function renderError() {
    el.tableBody.innerHTML = `
    <tr>
      <td colspan="4" class="text-center text-danger">取得に失敗しました</td>
    </tr>
  `;
}

function renderInstanceTable(instances) {
    el.tableBody.innerHTML = "";

    if (!instances || instances.length === 0) {
        el.tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">インスタンスなし</td>
      </tr>
    `;
        return;
    }

    instances.forEach(inst => {
        el.tableBody.appendChild(createInstanceRow(inst));
    });
}

function createInstanceRow(inst) {
    const tr = document.createElement("tr");

    const displayName = getInstanceDisplayName(inst);
    const closedAt = inst.closedAt
        ? new Date(inst.closedAt).toLocaleString()
        : "-";
    const disabled = inst.closedAt !== null;

    tr.innerHTML = `
    <td>${displayName}</td>
    <td>${inst.userCount}</td>
    <td>${closedAt}</td>
    <td class="d-flex gap-2">
      <button class="btn btn-success btn-sm" ${disabled ? "disabled" : ""}>
          起動
      </button>
      <button class="btn btn-danger btn-sm" ${disabled ? "disabled" : ""}>
        クローズ
      </button>
    </td>
  `;

    const [launchBtn, closeBtn] = tr.querySelectorAll("button");

    launchBtn.addEventListener("click", async () => {
        state.targetInstanceForLaunch = inst;
        await openClientModal();
    });

    closeBtn.addEventListener("click", () => {
        state.targetInstanceForClose = inst;
        el.closeInstanceName.textContent = getInstanceDisplayName(inst);
        modal.closeConfirm.show();
    });

    return tr;
}

// =====================
// handlers
// =====================
async function openClientModal() {
    const clients = await api.fetchClients();
    el.clientSelect.innerHTML = "";

    clients.forEach(client => {
        const opt = document.createElement("option");
        opt.value = client.id;

        if (client.description != null && client.description !== "") {
            opt.textContent = `${client.description} (${client.hostName})`;
        } else {
            opt.textContent = client.hostName;
        }

        el.clientSelect.appendChild(opt);
    });

    modal.client.show();
}

async function onLaunchConfirm() {
    const id = el.clientSelect.value;
    const inst = state.targetInstanceForLaunch;

    await api.launchInstance(id, {
        instance: inst,
        profile: 0,
        extraArgs: EXTRA_ARGS,
    });

    modal.client.hide();
}

async function onCloseConfirm() {
    await api.closeInstance(state.targetInstanceForClose);
    modal.closeConfirm.hide();
    await loadGroupInstances();
}

async function onCreateInstance() {
    const mode = document.querySelector(
        'input[name="instanceMode"]:checked'
    ).value;

    let displayName = null;
    if (mode === "select") displayName = el.selectInput.value;
    if (mode === "manual") {
        const name = el.manualInput.value.trim();
        if (!name) {
            alert("名前が入力されていません")
            return;
        }
        displayName = name;
    }

    if (displayName) {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");

        displayName += `_${y}${m}${d}_${hh}${mm}${ss}`;
    }

    const createdInstance = await api.createInstance({
        worldId: DEKAPU_WORLD_ID,
        type: "group",
        region: el.regionSelect.value,
        ownerId: state.selectedGroupId,
        groupAccessType: el.groupAccessTypeSelect.value,
        displayName,
        queueEnabled: el.queueEnabled.checked,
    });

    state.targetInstanceForLaunch = createdInstance;

    modal.createInstance.hide();
    await openClientModal();
}
