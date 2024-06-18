import {
  ListNavItems,
  NavItem,
  NavigationContainer,
  type NavigationProps,
} from "@keystone-6/core/admin-ui/components";
import React from "react";

export function CustomNavigation({
  authenticatedItem,
  lists,
}: NavigationProps) {
  console.log("CustomNavigation", lists);
  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <NavItem href="/">Dashboard</NavItem>
      <NavItem href="/stats">Stats</NavItem>
      <NavItem href="/api/swagger">Swagger (REST)</NavItem>
      <NavItem href="/api/graphql">Apollo (Graphql)</NavItem>
      <NavItem href="/ws/docskeysto">Socket (Websocket)</NavItem>
      <ListNavItems
        lists={lists.filter((e) => {
          return e.label.includes("Server");
        })}
      />
      <div
        style={{
          borderBottom: "1px solid #a2a2a2",
          marginBottom: "1rem",
          marginTop: "1rem",
        }}
      ></div>
      <ListNavItems
        lists={lists.filter((e) => {
          return !e.label.includes("Server");
        })}
      />
    </NavigationContainer>
  );
}
