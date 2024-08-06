import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { relationship, text } from "@keystone-6/core/fields";
import { schemaAccessConfig } from "~/lib/schema/access";
import { SchemaAccessTemplate } from "~/lib/schema/access/templates";

export const brandingDataList: Lists = {
  Branding: list({
    fields: {
      group: relationship({ ref: "Group.branding", many: false }),
      companyName: text(),
      companyMotto: text(),
      companyPhone: text(),
      companyEmail: text(),
      companyAddress: text(),
      companyWebsite: text(),
      companyDescription: text(),
      bannerLogoPhotoUrl: text(),
      lifestylePhotoUrl: text(),
      logoPhotoUrl: text(),
      colorPalette1: text(),
      colorPalette1Contrast: text(),
      colorPalette2: text(),
      colorPalette2Contrast: text(),
    },
    access: schemaAccessConfig({
      isAuthed: {
        all: true,
        read: false,
      },
      operations: {
        all: SchemaAccessTemplate.allow,
      },
      filter: {
        read: SchemaAccessTemplate.allow,
        write: SchemaAccessTemplate.quickMembershipCheck(),
      },
    }),
  }),
};
