import { AuthedSession, GlobalContext } from "../../types";

export type OperationArgs = {
  session: AuthedSession;
  context: GlobalContext;
  operation: "query" | "create" | "update" | "delete";
};

export type ItemArgs<N, O> = {
  session: AuthedSession;
  context: GlobalContext;
  operation: "query" | "create" | "update" | "delete";
  inputData?: N;
  item?: O;
};
