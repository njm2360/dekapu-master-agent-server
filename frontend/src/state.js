export const state = {
    selectedGroupId: null,
    targetInstanceForLaunch: null,
    targetInstanceForClose: null,
    instanceCache: {},// { [groupId]: { instances, fetchedAt } }
};
