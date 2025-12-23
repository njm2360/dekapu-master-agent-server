import { state } from "../state.js";
import { pageEl as el } from "../elements/page.js";
import { api } from "../api.js";
import { requestClose } from "../features/closeInstance.js"
import { openLaunchModal } from "./launcher.js";
import { getDisplayName } from "../utils.js";

export function initInstanceTable() {
    el.refreshBtn.addEventListener("click", () => {
        forceReloadGroupInstances();
    });
}

export async function loadGroupInstances() {
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

export async function forceReloadGroupInstances() {
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

function renderInstanceTable(instances) {
    el.tableBody.innerHTML = "";

    if (!instances || instances.length === 0) {
        el.tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">
          インスタンスなし
        </td>
      </tr>`;
        return;
    }

    instances.forEach(inst => {
        el.tableBody.appendChild(createInstanceRow(inst));
    });
}

function createInstanceRow(inst) {
    const tr = document.createElement("tr");

    const displayName = getDisplayName(inst);
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
        await openLaunchModal(inst);
    });

    closeBtn.addEventListener("click", () => {
        state.targetInstanceForClose = inst;
        requestClose(inst);
    });

    return tr;
}

function renderLoading() {
    el.tableBody.innerHTML = `
    <tr>
      <td colspan="4" class="text-center text-muted">
        読み込み中...
      </td>
    </tr>`;
}

function renderError() {
    el.tableBody.innerHTML = `
    <tr>
      <td colspan="4" class="text-center text-danger">
        取得に失敗しました
      </td>
    </tr>`;
}

function renderLastUpdated(date) {
    el.lastUpdated.textContent = date
        ? date.toLocaleString()
        : "未取得";
}
