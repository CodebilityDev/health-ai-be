import { FieldProps } from "@keystone-6/core/types";
import { FieldContainer, FieldLabel } from "@keystone-ui/fields";
import React from "react";

export const Field = ({
  field,
  value,
  onChange,
  autoFocus,
}: FieldProps<any>) => {
  const errVal = JSON.parse(value.initial.value);
  const message = errVal.message;
  const stack = errVal.stack;
  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      <div>
        <p>
          <strong>- [{message}]</strong>
        </p>
        <p
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            fontFamily: "monospace",
            fontSize: "0.8em",
          }}
        >
          {stack}
        </p>
      </div>
    </FieldContainer>
  );
};
