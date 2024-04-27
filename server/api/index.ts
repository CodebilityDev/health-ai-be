import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { authRouteDeclaration } from "./auth";
import { healthRouteDeclaration } from "./health";
extendZodWithOpenApi(z);

export const routeList = [authRouteDeclaration, healthRouteDeclaration];
