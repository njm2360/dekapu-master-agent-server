import type { InstanceInfo } from "./types/instance";

export function getDisplayName(instance: InstanceInfo): string {
    return instance.displayName || instance.name || "";
}

export function getLaunchUrl(instance: InstanceInfo): string {
    return `vrchat://launch?id=${instance.id}`;
}

export function getEl<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Element not found: #${id}`);
    }
    return el as T;
}

export function formatDate(n: Date): string {
    const pad = (v: number) => String(v).padStart(2, "0");
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
