import { createAuth } from "@keystone-6/auth";

import { statelessSessions } from "@keystone-6/core/session";

import { PERMISSION_ENUM } from "./common/roles";
import { AuthedSession } from "./common/types";
import { CONFIG } from "./utils/config/env";

let sessionSecret = CONFIG.SESSION_SECRET;

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",

  sessionData: "id name createdAt role",
  secretField: "adminPassword",

  initFirstItem: {
    fields: ["name", "email", "adminPassword"],
    itemData: {
      role: PERMISSION_ENUM.DEV,
    },
  },
});

const sessionMaxAge = 60 * 60 * 24 * 30;

const session = statelessSessions<AuthedSession>({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
});

export { session, withAuth };
