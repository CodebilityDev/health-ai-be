import * as dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  BREVO_TEMPLATE_2FA_LOGIN: process.env.BREVO_TEMPLATE_2FA_LOGIN || "7",
  BREVO_TEMPLATE_EVENT_REMINDER:
    process.env.BREVO_TEMPLATE_EVENT_REMINDER || "8",
  BREVO_TEMPLATE_NEW_ACCOUNT: process.env.BREVO_TEMPLATE_NEW_ACCOUNT || "4",
  BREVO_TEMPLATE_RESET_PASSWORD:
    process.env.BREVO_TEMPLATE_RESET_PASSWORD || "6",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://url",
  GRAPHQL_INSTROSPECTION: process.env.GRAPHQL_INSTROSPECTION || "true",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  MAILER_BREVO_API_KEY: process.env.MAILER_BREVO_API_KEY || "secret",
  MAILER_EMAILADDRESS: process.env.MAILER_EMAILADDRESS || "mailer@test.com",
  MAILER_NAME: process.env.MAILER_NAME || "mailer",
  NEW_ACCOUNT_URL: process.env.NEW_ACCOUNT_URL || "/new-account",
  PAGE_RESET_PASSWORD_URL:
    process.env.PAGE_RESET_PASSWORD_URL || "/reset-password",
  PAGE_URL: process.env.PAGE_URL || "http://localhost:300",
  RUN_CRON_JOB: process.env.RUN_CRON_JOB || "true",
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || "value",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "value",
  S3_ENDPOINT: process.env.S3_ENDPOINT || "https://value",
  S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE || "value",
  S3_REGION: process.env.S3_REGION || "value",
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || "value",
  SERVER_CORS_HEADERS:
    process.env.SERVER_CORS_HEADERS ||
    '"Origin, X-Requested-With, Content-Type, Accept, Authorization"',
  SERVER_CORS_URL: process.env.SERVER_CORS_URL || '"*"',
  SESSION_SECRET:
    process.env.SESSION_SECRET ||
    '"secretashdasifhjldgjaisjflsjkasldfklaskdjf"',
};
