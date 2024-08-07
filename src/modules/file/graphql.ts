import { z } from "zod";
import { CONFIG } from "~/common/env";
import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";
import { minioClient } from "~/services/file/minio";

const fileGQLDeclaration = new GraphqlMethodDeclarationList();

fileGQLDeclaration.add(
  new GraphqlActionMetadata({
    root: "Mutation",
    name: "file_generateUploadURL",
    output: [
      {
        name: "FileUploadURL",
        schema: z.object({
          getURL: z.string(),
          putURL: z.string(),
        }),
      },
    ],
    input: z.object({
      fileID: z.string(),
    }),
    resolve: async (_, { fileID }, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      // get the file extension at the end of the fileID (note that it might have multiple dots)
      const fileExt = fileID.split(".").pop();
      const fileNameWithoutExt = fileID.split(".").slice(0, -1).join(".");

      let concatName =
        `${context.session?.itemId ?? "anon"}/${fileNameWithoutExt}-${Date.now()}` +
        "." +
        fileExt;

      const presignUrl = await minioClient.presignedPutObject(
        CONFIG.S3_BUCKET_NAME,
        `public/${concatName}`,
        60 * 60 * 24,
      );

      const getUrl = `${CONFIG.S3_ENDPOINT}/${CONFIG.S3_BUCKET_NAME}/public/${concatName}`;

      return {
        getURL: getUrl,
        putURL: presignUrl,
      };
    },
  }),
);

export { fileGQLDeclaration };
