import { getEl } from "../utils";

export const toastEl = {
    launchSuccess: getEl<HTMLDivElement>("launchSuccessToast"),
    copySuccess: getEl<HTMLDivElement>("copySuccessToast"),
};
