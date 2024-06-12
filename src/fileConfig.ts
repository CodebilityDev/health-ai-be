import { StorageConfig } from "@keystone-6/core/types";
import { CONFIG } from "~/utils/config/env";

const s3FilesStorageConfig: StorageConfig = {
  kind: "s3",
  type: "file",
  bucketName: CONFIG.S3_BUCKET_NAME,
  region: CONFIG.S3_REGION,
  accessKeyId: CONFIG.S3_ACCESS_KEY_ID,
  secretAccessKey: CONFIG.S3_SECRET_ACCESS_KEY,
  signed: { expiry: 5000 },
  endpoint: CONFIG.S3_ENDPOINT,
  forcePathStyle: CONFIG.S3_FORCE_PATH_STYLE === "true",
};

export const s3FilesConfigKey = "my_S3_files";
export default s3FilesStorageConfig;
