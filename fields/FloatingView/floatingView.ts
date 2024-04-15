import {
  BaseListTypeInfo,
  FieldTypeFunc,
  CommonFieldConfig,
  fieldType,
  orderDirectionEnum,
} from "@keystone-6/core/types";
import { graphql } from "@keystone-6/core";

export type MyFloatingView<ListTypeInfo extends BaseListTypeInfo> =
  CommonFieldConfig<ListTypeInfo>;

export const floatingView =
  <ListTypeInfo extends BaseListTypeInfo>(
    config: MyFloatingView<ListTypeInfo> = {},
  ): FieldTypeFunc<ListTypeInfo> =>
  (meta) =>
    fieldType({
      kind: "scalar",
      mode: "optional",
      scalar: "Int",
    })({
      ...config,
      isFilterable: false,
      isOrderable: false,
      // graphql: {
      //   omit: true,
      // },
      input: {
        create: { arg: graphql.arg({ type: graphql.Int }) },
        update: { arg: graphql.arg({ type: graphql.Int }) },
        orderBy: { arg: graphql.arg({ type: orderDirectionEnum }) },
      },
      output: graphql.field({ type: graphql.Int }),
      views: "./admin/components/floatingViewComponent.tsx",
    });
