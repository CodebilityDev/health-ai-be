import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { Heading } from "@keystone-ui/core";
import React from "react";
import "../styles/global.css";

export default function GlobalTemplate(props: {
  headerTitle: string;
  children: React.ReactNode;
}) {
  return (
    <PageContainer header={<Heading type="h3">{props.headerTitle}</Heading>}>
      {props.children}
    </PageContainer>
  );
}
