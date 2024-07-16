import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { image, relationship, text } from "@keystone-6/core/fields";
import { s3ImageConfigKey } from "~/config/imageConfig";

export const postDataList: Lists = {
  Post: list({
    fields: {
      title: text({ validation: { isRequired: true } }),
      content: text({ validation: { isRequired: true } }),
      tags: relationship({ ref: "PostTag.posts", many: true }),
      coverImage: image({
        storage: s3ImageConfigKey,
      }),
      // author: relationship({ ref: "User.posts", many: false }),
    },
    access: allowAll,
  }),
  PostTag: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      posts: relationship({ ref: "Post.tags", many: true }),
    },
    access: allowAll,
  }),
};
