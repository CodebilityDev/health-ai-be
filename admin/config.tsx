import type { AdminConfig } from "@keystone-6/core/types";
import { CustomNavigation } from "./components/CustomNavigation";

function CustomLogo() {
  return <h3>DMCC</h3>;
}

export const components: AdminConfig["components"] = {
  Navigation: CustomNavigation,
  Logo: CustomLogo,
};
