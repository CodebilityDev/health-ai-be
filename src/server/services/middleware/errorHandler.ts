import { KeystoneContext } from "@keystone-6/core/types";
import { Request, Response, NextFunction } from "express";
import { GlobalTypeInfo } from "../../../common/types";

/**
 * Handler to catch `async` operation errors.
 * Reduces having to write `try-catch` all the time.
 */
export const catchErrors =
  (action: Function, context: KeystoneContext<GlobalTypeInfo>) =>
  (req: Request, res: Response, next: NextFunction) =>
    action(req, res, context).catch(next);

/**
 * Show useful information to client in development.
 */

export const devErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.stack = err.stack || "";
  const status = err.status || 500;
  const error = { message: err.message };
  res.status(status);
  return res.json({ status, error });
};
