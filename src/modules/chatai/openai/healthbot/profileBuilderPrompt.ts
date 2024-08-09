export const DEFAULT_FIELDS = [
  "location_id",
  "first_name",
  "last_name",
  "agent_first_name",
  "agent_last_name",
  "emailLowerCase",
  "timezone",
  "companyName",
  "phone",
  "type",
  "source",
  "address1",
  "city",
  "state",
  "country",
  "postalCode",
  "website",
  "dateOfBirth",
  "gender",

  // "id",
  // "email",
  // "timezone",
  // "country",
  // "contactName",
];

export const UPDATABLE_FIELDS = [
  "companyName",
  "phone",
  "type",
  "address1",
  "city",
  "state",
  "country",
  "postalCode",
  "website",
  "dateOfBirth",
  "gender",
];

export const profileBuilderPrompt = (args: {
  userInfo: any;
  filter?: string[];
}) => {
  const fieldsFilter = [...DEFAULT_FIELDS, ...(args.filter || [])];
  const updatableFields = [...UPDATABLE_FIELDS, ...(args.filter || [])];

  const customFields = args.userInfo.customFields || [];

  args.userInfo = {
    ...args.userInfo,
    ...customFields.reduce((acc: any, field: any) => {
      acc[field.name] = field.value;
      return acc;
    }, {} as any),
  };

  const filteredUserInfo = Object.keys(args.userInfo).reduce((acc, key) => {
    if (fieldsFilter.includes(key)) {
      acc[key] = args.userInfo[key];
    }
    return acc;
  }, {} as any);

  const st = `[profilePrompt] This is my latest identity information. Use these data to properly address me or consider my needs: ${JSON.stringify(filteredUserInfo)}`;

  return {
    prompt: st,
    userInfo: filteredUserInfo,
    fieldsFilter: updatableFields,
  };
};
