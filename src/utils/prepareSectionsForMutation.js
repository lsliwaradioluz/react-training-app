import { cloneDeep, omit } from "src/imports/react";

const clearData = (data) => {
  let dataClone = cloneDeep(data);
  if (Array.isArray(dataClone)) {
    return dataClone.map((el) => clearData(el));
  }

  for (let key in dataClone) {
    if (Array.isArray(dataClone[key])) {
      dataClone[key] = dataClone[key].map((el) => clearData(el));
    } else if (key === "exercise") {
      dataClone[key] = dataClone[key].id;
    }
  }

  return omit(dataClone, "__typename", "id");
};

export default clearData;

