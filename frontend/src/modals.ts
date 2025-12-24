import { Modal } from "bootstrap";
import { getEl } from "./utils";

export const modal = {
    launchOptions: new Modal(
        getEl<HTMLDivElement>("launchOptionsModal")
    ),
    closeConfirm: new Modal(
        getEl<HTMLDivElement>("closeConfirmModal")
    ),
    createInstance: new Modal(
        getEl<HTMLDivElement>("createInstanceModal")
    ),
    createComplete: new Modal(
        getEl<HTMLDivElement>("createCompleteModal")
    ),
};
