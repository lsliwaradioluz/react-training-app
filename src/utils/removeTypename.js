import { cloneDeep, omit } from "src/imports/react";

const removeTypename = (data) => {
  let dataClone = cloneDeep(data);
  if (Array.isArray(dataClone)) {
    return dataClone.map((el) => removeTypename(el));
  }

  for (let key in dataClone) {
    if (Array.isArray(dataClone[key])) {
      dataClone[key] = dataClone[key].map((el) => removeTypename(el));
    } else if (key === "exercise") {
      dataClone[key] = dataClone[key].id;
    }
  }

  return omit(dataClone, "__typename", "id");
};

export default removeTypename;

