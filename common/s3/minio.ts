import { Client } from "minio";
import { CONFIG } from "../../utils/config/env";

export const minioClient = new Client({
  endPoint: CONFIG.S3_ENDPOINT.replace("https://", "").replace("http://", ""),
  useSSL: true,
  accessKey: CONFIG.S3_ACCESS_KEY_ID,
  secretKey: CONFIG.S3_SECRET_ACCESS_KEY,
  region: CONFIG.S3_REGION,
  pathStyle: CONFIG.S3_FORCE_PATH_STYLE === "true",
});
