import { cloneDeep, omit } from "src/imports/react";

const deleteKeys = (data, keys) => {
  let dataClone = cloneDeep(data);
  if (Array.isArray(dataClone)) {
    return dataClone.map((el) => deleteKeys(el, keys));
  }

  for (let key in dataClone) {
    if (Array.isArray(dataClone[key])) {
      dataClone[key] = dataClone[key].map((el) => deleteKeys(el, keys));
    }
  }


  return omit(dataClone, ...keys);
};

export default deleteKeys;

