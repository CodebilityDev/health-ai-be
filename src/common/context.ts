import { TypeInfo } from ".keystone/types";
import { KeystoneContext } from "@keystone-6/core/types";

export type AuthedSession = {
  listKey: string;
  itemId: string;
  data: {
    id: string;
    name: string;
    createdAt: string;
    role: string;
  };
};

export type GlobalTypeInfo = TypeInfo<AuthedSession>;
export type GlobalContext = KeystoneContext<GlobalTypeInfo>;

export type GlobalDataTypes = keyof GlobalTypeInfo["lists"];
export const GlobalDataType = (_key: GlobalDataTypes): GlobalDataTypes => _key;

export const PERMISSION_ENUM = {
  DEV: "dev",
  ADMIN: "admin",
  USER: "user",
};

export const ALL_PERMISSIONS_LIST = Object.values(PERMISSION_ENUM);

export const ACCESS_LEVELS = {
  VIEW: 1,
  EDIT: 2,
  ADMIN: 3,
};
