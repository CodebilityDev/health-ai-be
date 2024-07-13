import { UserRoleType } from "~/common/graphql-types";
import { deepMerge } from "~/functions/deepMerge";
import { ItemArgs, OperationArgs } from "./types";

export const schemaAccessConfig = <T, N = any, O = any>(generatorArgs: {
  isAuthed?:
    | {
        all?: boolean;
        read?: boolean;
        write?: boolean;
        create?: boolean;
        update?: boolean;
        delete?: boolean;
      }
    | boolean;
  superAccess?: string[];
  operations: {
    all?: (context: OperationArgs) => boolean;
    read?: (context: OperationArgs) => boolean;
    write?: (context: OperationArgs) => boolean;
    create?: (context: OperationArgs) => boolean;
    update?: (context: OperationArgs) => boolean;
    delete?: (context: OperationArgs) => boolean;
  };
  filter: {
    all?: (context: OperationArgs) => boolean | Record<string, any>;
    read?: (context: OperationArgs) => boolean | Record<string, any>;
    write?: (context: OperationArgs) => boolean | Record<string, any>;
    update?: (context: OperationArgs) => boolean | Record<string, any>;
    delete?: (context: OperationArgs) => boolean | Record<string, any>;
  };

  item?: {
    all?: (context: ItemArgs<N, O>) => boolean;
    read?: (context: ItemArgs<N, O>) => boolean;
    write?: (context: ItemArgs<N, O>) => boolean;
    create?: (context: ItemArgs<N, O>) => boolean;
    update?: (context: ItemArgs<N, O>) => boolean;
    delete?: (context: ItemArgs<N, O>) => boolean;
  };
  extraConfig?: Partial<T>;
}) => {
  const globalMiddleware = (operation: OperationArgs) => {
    let throwAuthError = false;

    let isLoggedIn = operation.context.session?.itemId;

    if (typeof generatorArgs.isAuthed === "boolean") {
      throwAuthError = !generatorArgs.isAuthed;
    } else {
      switch (operation.operation) {
        case "query":
          let shouldCheck =
            generatorArgs.isAuthed?.read ?? generatorArgs.isAuthed?.all;
          if (shouldCheck) {
            throwAuthError = !isLoggedIn;
          }
          break;
        case "create":
          let shouldCheckCreate =
            generatorArgs.isAuthed?.create ??
            generatorArgs.isAuthed?.write ??
            generatorArgs.isAuthed?.all;
          if (shouldCheckCreate) {
            throwAuthError = !isLoggedIn;
          }
          break;
        case "update":
          let shouldCheckUpdate =
            generatorArgs.isAuthed?.update ??
            generatorArgs.isAuthed?.write ??
            generatorArgs.isAuthed?.all;
          if (shouldCheckUpdate) {
            throwAuthError = !isLoggedIn;
          }
          break;
        case "delete":
          let shouldCheckDelete =
            generatorArgs.isAuthed?.delete ??
            generatorArgs.isAuthed?.write ??
            generatorArgs.isAuthed?.all;
          if (shouldCheckDelete) {
            throwAuthError = !isLoggedIn;
          }
          break;
        default:
          throw new Error("Invalid operation");
      }
    }

    if (throwAuthError) {
      throw new Error("Not Authenticated");
    }

    if (!isLoggedIn) {
      // we wont do anymore checks, we allow guest access
      return true;
    }

    const superAccessRoles = [
      ...(generatorArgs.superAccess || []),
      UserRoleType.Dev,
    ];

    // check for dev super user
    if (superAccessRoles.includes(operation.session.data.role)) {
      return true;
    }

    return false;
  };
  const baseConfig = <T>{
    operation: {
      query: (args: OperationArgs) => {
        let checkerFunction =
          generatorArgs.operations.read ?? generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      create: (args: OperationArgs) => {
        let checkerFunction =
          generatorArgs.operations.create ??
          generatorArgs.operations.write ??
          generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      update: (args: OperationArgs) => {
        let checkerFunction =
          generatorArgs.operations.update ??
          generatorArgs.operations.write ??
          generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      delete: (args: OperationArgs) => {
        let checkerFunction =
          generatorArgs.operations.delete ??
          generatorArgs.operations.write ??
          generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
    },
    filter: {
      query: (args: OperationArgs) => {
        let checkerFunction =
          generatorArgs.filter.read || generatorArgs.filter.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      update: (args: OperationArgs) => {
        let checkerFunction =
          generatorArgs.filter.update ??
          generatorArgs.filter.write ??
          generatorArgs.filter.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      delete: (args: OperationArgs) => {
        let checkerFunction =
          generatorArgs.filter.delete ??
          generatorArgs.filter.write ??
          generatorArgs.filter.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
    },
    ...(generatorArgs.item
      ? {
          item: {
            create: (args: ItemArgs<N, O>) => {
              let checkerFunction =
                generatorArgs.item!.create ??
                generatorArgs.item!.write ??
                generatorArgs.item?.all;
              if (!checkerFunction) {
                checkerFunction = () => true;
              }
              return globalMiddleware(args) || checkerFunction(args);
            },
            update: (args: ItemArgs<N, O>) => {
              let checkerFunction =
                generatorArgs.item!.update ??
                generatorArgs.item!.write ??
                generatorArgs.item?.all;
              if (!checkerFunction) {
                checkerFunction = () => true;
              }
              return (
                globalMiddleware(args) ??
                checkerFunction(args) ??
                generatorArgs.operations.all
              );
            },
            delete: (args: ItemArgs<N, O>) => {
              let checkerFunction =
                generatorArgs.item!.delete ??
                generatorArgs.item!.write ??
                generatorArgs.item?.all;
              if (!checkerFunction) {
                checkerFunction = () => true;
              }
              return globalMiddleware(args) || checkerFunction(args);
            },
          },
        }
      : {}),
  };

  return <T>(
    deepMerge([baseConfig, (generatorArgs.extraConfig || {}) as Partial<T>])
  );
};
