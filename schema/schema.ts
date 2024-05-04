import type { Lists } from ".keystone/types";
import { postDataList } from "./PostData";
import { userDataList } from "./UserData";

export const lists: Lists = {
  ...userDataList,
  ...postDataList,
};
