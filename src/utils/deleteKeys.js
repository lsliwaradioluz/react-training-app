import { cloneDeep } from "src/imports/react";

const deleteKeys = (data = {}, keys = []) => {
  let dataClone = cloneDeep(data);
  if (
    typeof dataClone === "object" &&
    dataClone !== null &&
    !Array.isArray(dataClone)
  ) {
    for (let key of keys) {
      delete dataClone[key];
    }
    for (let key in dataClone) {
      dataClone[key] = deleteKeys(dataClone[key], keys);
    }
  } else if (Array.isArray(dataClone)) {
    return dataClone.map((d) => deleteKeys(d, keys));
  }

  return dataClone;
};

export default deleteKeys;
