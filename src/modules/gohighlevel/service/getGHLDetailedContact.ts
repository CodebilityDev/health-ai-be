import { GlobalContext } from "~/common/context";
import { getGHLContact } from "./getGHLContacts";
import { getGHLCustomFields } from "./getGHLCustomFields";

export const getGHLDetailedContact = async (args: {
  context: GlobalContext;
  groupID: string;
  input: {
    id: string;
  };
}) => {
  const contactList = await getGHLContact({
    context: args.context,
    groupID: args.groupID,
    contactID: args.input.id,
  });

  const customFields = await getGHLCustomFields({
    context: args.context,
    groupID: args.groupID,
  });

  // replace customFields with actual values
  contactList.customFields = contactList.customFields.map((field) => {
    const customField = customFields.customFields.find(
      (cf) => cf.id === field.id,
    );
    return {
      id: field.id,
      name: customField?.name ?? field.id,
      value: field.value,
    };
  });

  return contactList;
};
