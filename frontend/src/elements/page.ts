import { getEl } from "../utils";

export const pageEl = {
    groupSelect: getEl<HTMLInputElement>("groupSelect"),
    tableBody: getEl<HTMLTableElement>("instanceTableBody"),
    lastUpdated: getEl<HTMLSpanElement>("lastUpdated"),
    refreshBtn: getEl<HTMLButtonElement>("refreshBtn"),

    openCreateModalBtn: getEl<HTMLButtonElement>("openCreateModalBtn"),
};
