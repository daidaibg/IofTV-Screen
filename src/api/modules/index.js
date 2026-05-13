import * as API from "../api";

export const paramType = {
  big1: "/bigscreen/countUserNum",
  big2: "/bigscreen/countDeviceNum",
  big3: "/bigscreen/sbtx",
  big4: "/bigscreen/alarmNum",
  big5: "/bigscreen/ssyj",
  big6: "/bigscreen/installationPlan",
  big7: "/bigscreen/ranking",
  big8: "/bigscreen/centermap",
};

const resolvePath = (key, suffix = "") => `${paramType[key]}${suffix}`;

const createGetAction = (suffix = "") => (key, params) =>
  API.GET(resolvePath(key, suffix), params);

const createPostAction = (suffix = "") => (key, params) =>
  API.POST(resolvePath(key, suffix), params);

export const currentList = createGetAction("/list");
export const currentPage = createGetAction("/page");
export const currentSelectList = createGetAction("/selectList");
export const currentSave = createPostAction("/save");
export const currentUpdate = createPostAction("/update");
export const currentDelete = createPostAction("/delete");
export const currentSelect = createGetAction("/select");
export const currentGET = createGetAction();
export const currentPOST = createPostAction();

export const currentApi = {
  currentList,
  currentPage,
  currentSave,
  currentUpdate,
  currentDelete,
  currentSelect,
  currentSelectList,
  currentPOST,
  currentGET,
};
