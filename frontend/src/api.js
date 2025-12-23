export const api = {
    async fetchGroupInstances(groupId) {
        return fetch(`/api/groups/${groupId}/instances`)
            .then(r => r.json());
    },

    async fetchInstanceDetail(item) {
        return fetch(
            `/api/instances/${item.world.id}:${item.instanceId}`
        ).then(r => r.json());
    },

    async fetchClients() {
        return fetch("/api/control/clients").then(r => r.json());
    },

    async launchInstance(id, body) {
        const res = await fetch(`/api/control/${id}/launch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return res;
    },

    async closeInstance(inst) {
        return fetch(
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
        if (!res.ok) throw new Error();
        return res.json();
    },
};
