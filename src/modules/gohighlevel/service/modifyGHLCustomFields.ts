import { GlobalContext } from "~/common/context";
import { CachedLocationCustomFields } from "./getGHLCustomFields";
import { getAccessToken } from "./getGHLToken";

export type CustomFieldDataType = {
  name: string;
};

export const createCustomField = async (args: {
  context: GlobalContext;
  groupID: string;
  input: CustomFieldDataType;
}): Promise<any> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
  });

  const resp = await fetch(
    `https://services.leadconnectorhq.com/locations/${accessToken?.locationId}/customFields`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken?.accessToken}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: args.input.name,
        dataType: "TEXT",
        model: "contact",
      }),
    },
  );

  const data = await resp.json();

  if (accessToken?.locationId)
    delete CachedLocationCustomFields[accessToken?.locationId!];

  return data;
};

export const updateCustomField = async (args: {
  context: GlobalContext;
  groupID: string;
  input: {
    id: string;
  } & CustomFieldDataType;
}): Promise<any> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
  });

  const resp = await fetch(
    `https://services.leadconnectorhq.com/locations/${accessToken?.locationId}/customFields/${args.input.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken?.accessToken}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: args.input.name,
      }),
    },
  );

  const data = await resp.json();

  if (accessToken?.locationId)
    delete CachedLocationCustomFields[accessToken?.locationId!];
  return data;
};

export const deleteCustomField = async (args: {
  context: GlobalContext;
  groupID: string;
  input: {
    id: string;
  };
}): Promise<any> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
  });

  const resp = await fetch(
    `https://services.leadconnectorhq.com/locations/${accessToken?.locationId}/customFields/${args.input.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken?.accessToken}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  const data = await resp.json();
  if (accessToken?.locationId)
    delete CachedLocationCustomFields[accessToken?.locationId!];

  return data;
};
