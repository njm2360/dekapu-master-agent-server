import { pageEl as el } from "../elements/page";
import { api } from "../api/api";
import { openCloseModal } from "./closeInstance"
import { openLaunchModal } from "./launcher";
import { getDisplayName } from "../utils";
import type { InstanceInfo } from "../types/instance";

interface InstanceCacheEntry {
  instances: InstanceInfo[];
  fetchedAt: string;
}

const instanceCache: Record<string, InstanceCacheEntry> = {}

export function initInstanceTable(onRefresh: () => void): void {
  el.refreshBtn.addEventListener("click", onRefresh);
}

export async function loadGroupInstances(groupId: string): Promise<void> {
  renderLastUpdated(undefined);

  const cache = instanceCache[groupId];
  if (cache) {
    renderInstanceTable(cache.instances);
    renderLastUpdated(new Date(cache.fetchedAt));
    return;
  }

  await forceReloadGroupInstances(groupId);
}

export async function forceReloadGroupInstances(groupId: string): Promise<void> {
  renderLoading();
  renderLastUpdated(undefined);

  try {
    const list = await api.fetchGroupInstances(groupId);
    const details = await Promise.all(list.map(api.fetchInstanceDetail));

    const now = new Date();
    instanceCache[groupId] = { instances: details, fetchedAt: now.toLocaleString() };

    renderInstanceTable(details);
    renderLastUpdated(now);
  } catch {
    renderError();
    renderLastUpdated(undefined);
  }
}

function renderInstanceTable(instances: InstanceInfo[]) {
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

function createInstanceRow(inst: InstanceInfo): HTMLTableRowElement {
  const tr = document.createElement("tr");

  const displayName = getDisplayName(inst);
  const closedAtText = inst.closedAt ? new Date(inst.closedAt).toLocaleString() : "-";
  const disabled = Boolean(inst.closedAt);

  tr.innerHTML = `
    <td>${displayName}</td>
    <td>${inst.userCount}</td>
    <td>${closedAtText}</td>
    <td class="d-flex gap-2">
      <button data-action="launch" class="btn btn-success btn-sm" ${disabled ? "disabled" : ""}>
        起動
      </button>
      <button data-action="close" class="btn btn-danger btn-sm" ${disabled ? "disabled" : ""}>
        クローズ
      </button>
    </td>
  `;

  const launchBtn = tr.querySelector<HTMLButtonElement>('button[data-action="launch"]');
  const closeBtn = tr.querySelector<HTMLButtonElement>('button[data-action="close"]');
  if (!launchBtn || !closeBtn) {
    throw new Error("Row buttons not found");
  }

  launchBtn.addEventListener("click", async () => {
    await openLaunchModal(inst);
  });

  closeBtn.addEventListener("click", () => {
    openCloseModal(inst);
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

function renderLastUpdated(date?: Date): void {
  el.lastUpdated.textContent = date ? date.toLocaleString() : "未取得";
}
