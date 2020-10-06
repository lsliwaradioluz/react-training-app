import * as actionTypes from "src/store/actionTypes/assistant";

export const manageAssistant = (assistantState) => {
  return { type: actionTypes.MANAGE_ASSISTANT, assistantState };
};