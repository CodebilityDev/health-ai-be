import { GlobalContext } from "~/common/context";
import { getAccessToken } from "./getGHLToken";

type CustomField = {
  id: string;
  name: string;
  fieldKey: string;
  placeholder: string;
  dataType: string;
  position: number;
  picklistOptions: string[];
  picklistImageOptions: any[]; // Assuming picklistImageOptions can be of any type, replace with appropriate type if known
  isAllowedCustomOption: boolean;
  isMultiFileAllowed: boolean;
  maxFileLimit: number;
  locationId: string;
  model: string;
};

type CustomFieldsData = {
  customFields: CustomField[];
};

export const CachedLocationCustomFields: Record<
  string,
  CustomFieldsData | null
> = {};

export const clearCustomFieldsCache = (locationId: string) => {
  CachedLocationCustomFields[locationId] = null;
};

export const getGHLCustomFields = async (args: {
  context: GlobalContext;
  groupID: string;
  model?: "contact" | "opportunity" | "all" | string;
}): Promise<CustomFieldsData> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
  });

  if (!accessToken?.locationId) {
    throw new Error("Unauthorized");
  }

  // if (CachedLocationCustomFields[accessToken?.locationId]) {
  //   return CachedLocationCustomFields[
  //     accessToken?.locationId
  //   ] as CustomFieldsData;
  // }

  const resp = await fetch(
    `https://services.leadconnectorhq.com/locations/${accessToken?.locationId}/customFields?model=${args.model ?? "all"}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken?.accessToken}`,
        Accept: "application/json",
        Version: "2021-07-28",
      },
    },
  );

  const data = await resp.json();

  CachedLocationCustomFields[accessToken?.locationId] = data;

  return data;
};
