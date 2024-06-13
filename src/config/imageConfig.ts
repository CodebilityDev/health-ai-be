import { StorageConfig } from "@keystone-6/core/types";
import { CONFIG } from "~/utils/config/env";

const s3ImageStorageConfig: StorageConfig = {
  kind: "s3",
  type: "image",
  bucketName: CONFIG.S3_BUCKET_NAME,
  region: CONFIG.S3_REGION,
  accessKeyId: CONFIG.S3_ACCESS_KEY_ID,
  secretAccessKey: CONFIG.S3_SECRET_ACCESS_KEY,
  signed: { expiry: 5000 },
  endpoint: CONFIG.S3_ENDPOINT,
  forcePathStyle: CONFIG.S3_FORCE_PATH_STYLE === "true",
};

export const s3ImageConfigKey = "my_S3_images";
export default s3ImageStorageConfig;
