// view.tsx

import { FieldContainer, FieldLabel } from "@keystone-ui/fields";
import {
  CardValueComponent,
  CellComponent,
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from "@keystone-6/core/types";
import { CellContainer, CellLink } from "@keystone-6/core/admin-ui/components";

export const controller = (
  config: FieldControllerConfig
): FieldController<string, string> => {
  return {
    path: config.path,
    label: config.label,
    graphqlSelection: config.path,
    defaultValue: "",
    description: "",
    deserialize: (data) => {
      const value = data[config.path];
      return typeof value === "number" ? value + "" : "";
    },
    serialize: (value) => ({
      [config.path]: value === "" ? null : parseInt(value, 10),
    }),
  };
};

// Shown in ITEM view
export const Field = ({
  field,
  value,
  onChange,
  autoFocus,
}: FieldProps<typeof controller>) => (
  <FieldContainer>
    <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
    Item View
  </FieldContainer>
);

// Shown in LIST view
export const Cell: CellComponent = ({ item, field, linkTo }) => {
  let value = item[field.path] + "";
  return <CellContainer>Cell View</CellContainer>;
};
Cell.supportsLinkTo = true;

// Shown in CARD view
export const CardValue: CardValueComponent = ({ item, field }) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      Card View
    </FieldContainer>
  );
};
