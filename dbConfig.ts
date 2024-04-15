import { DatabaseConfig } from "@keystone-6/core/types";
import { GlobalTypeInfo } from "./common/types";
import { CONFIG } from "./utils/config/env";

const dbConfig: DatabaseConfig<GlobalTypeInfo> = {
  provider: "postgresql",
  url: CONFIG.DATABASE_URL,
};

export default dbConfig;
