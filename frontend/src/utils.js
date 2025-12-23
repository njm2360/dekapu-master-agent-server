export function getDisplayName(instance) {
    return instance.displayName || instance.name || "";
}

export function getLaunchUrl(instance) {
    return `vrchat://launch?id=${instance.id}`;
}
