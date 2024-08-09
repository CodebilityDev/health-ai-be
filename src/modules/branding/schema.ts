import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { json, relationship, text } from "@keystone-6/core/fields";
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
      lifestylePhotoUrls: json({
        hooks: {
          validateInput(args) {
            // make sure that json is an array of strings or that it is empty
            if (
              args.inputData.lifestylePhotoUrls &&
              !Array.isArray(args.inputData.lifestylePhotoUrls)
            ) {
              throw new Error("lifestylePhotoUrls must be an array");
            }
          },
        },
      }),
      logoPhotoUrl: text(),
      colorPalette1: text(),
      colorPalette1Contrast: text(),
      colorPalette2: text(),
      colorPalette2Contrast: text(),
      backgroundColor: text(),
      textColor: text(),
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
  Analytic: list({
    fields: {
      group: relationship({ ref: "Group.analytic", many: false }),
      utm_baseurl: text(),
      utm_source: text(),
      utm_medium: text(),
      utm_campaign: text(),
      utm_language: text(),
      generated_marketing_url: text(),
      direct_link: text(),
      google_analytics_id: text(),
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
