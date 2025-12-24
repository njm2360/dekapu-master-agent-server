import { http } from "./httpClient";

import type { GroupInstance, GroupRole } from "../types/group";
import type { Client, LaunchOptions } from "../types/control";
import type { CreateInstanceConfig, InstanceInfo } from "../types/instance";

export const api = {
  fetchGroupInstances(groupId: string): Promise<GroupInstance[]> {
    return http<GroupInstance[]>(
      `/api/groups/${groupId}/instances`
    );
  },

  fetchGroupRoles(groupId: string): Promise<GroupRole[]> {
    return http<GroupRole[]>(
      `/api/groups/${groupId}/roles`
    );
  },

  fetchInstanceDetail(item: GroupInstance): Promise<InstanceInfo> {
    return http<InstanceInfo>(
      `/api/instances/${item.world.id}:${item.instanceId}`
    );
  },

  fetchClients(): Promise<Client[]> {
    return http<Client[]>(
      "/api/control/clients"
    );
  },

  launchInstance(id: string, options: LaunchOptions): Promise<void> {
    return http<void>(
      `/api/control/${id}/launch`,
      {
        method: "POST",
        body: JSON.stringify(options),
      }
    );
  },

  closeInstance(inst: InstanceInfo): Promise<InstanceInfo> {
    return http<InstanceInfo>(
      `/api/instances/${inst.worldId}:${inst.instanceId}`,
      { method: "DELETE" }
    );
  },

  createInstance(body: CreateInstanceConfig): Promise<InstanceInfo> {
    return http<InstanceInfo>(
      "/api/instances/",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  },
};
