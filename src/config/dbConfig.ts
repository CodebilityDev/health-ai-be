import { DatabaseConfig } from "@keystone-6/core/types";
import { GlobalTypeInfo } from "~/common/context";
import { CONFIG } from "~/common/env";

const dbConfig: DatabaseConfig<GlobalTypeInfo> = {
  provider: "postgresql",
  url: CONFIG.DATABASE_URL,
};

export default dbConfig;
