import { allOperations, denyAll } from "@keystone-6/core/access";

export const deniedAll = {
  operation: {
    ...allOperations(denyAll),
  },
  filter: {
    ...allOperations(denyAll),
  },
  item: {
    ...allOperations(denyAll),
  },
};
