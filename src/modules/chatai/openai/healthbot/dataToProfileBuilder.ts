import { UPDATABLE_FIELDS } from "~modules/chatai/openai/healthbot/profileBuilderPrompt";

export const FIELDS_MAP: Record<string, any> = {
  location_id: null,
  first_name: "firstName",
  last_name: "lastName",
  agent_first_name: null,
  agent_last_name: null,
};

export const dataToProfileBuilder = (args: {
  newUserData: any;
  customFieldsNameAndID: Record<string, string>;
}) => {
  const dataUpdate: Record<string, any> = {};
  const specialKeys = Object.keys(FIELDS_MAP);
  const customKeys = Object.keys(args.customFieldsNameAndID);
  for (let newKey in args.newUserData) {
    if (specialKeys.includes(newKey)) {
      if (FIELDS_MAP[newKey]) {
        dataUpdate[FIELDS_MAP[newKey]] = args.newUserData[newKey];
      }
    } else if (customKeys.includes(newKey)) {
      if (!dataUpdate.customFields) {
        dataUpdate.customFields = [];
      }
      dataUpdate.customFields.push({
        id: args.customFieldsNameAndID[newKey],
        field_value: args.newUserData[newKey],
      });
    } else if (UPDATABLE_FIELDS.includes(newKey)) {
      dataUpdate[newKey] = args.newUserData[newKey];
    }
  }

  return dataUpdate;
};
