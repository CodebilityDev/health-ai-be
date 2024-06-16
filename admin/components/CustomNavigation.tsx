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
  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <NavItem href="/">Dashboard</NavItem>
      <NavItem href="/stats">Stats</NavItem>
      <NavItem href="/api/swagger">Swagger (REST)</NavItem>
      <NavItem href="/api/graphql">Apollo (Graphql)</NavItem>
      <ListNavItems lists={lists} />
    </NavigationContainer>
  );
}
