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
