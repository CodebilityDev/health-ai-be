import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { authRouteDeclaration } from "./auth";
extendZodWithOpenApi(z);

export const routeList = [authRouteDeclaration];
