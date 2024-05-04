"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_server_plugin_response_cache = __toESM(require("@apollo/server-plugin-response-cache"));
var import_zod_to_openapi4 = require("@asteasolutions/zod-to-openapi");
var import_core5 = require("@keystone-6/core");
var import_zod6 = require("zod");

// auth.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");

// common/roles.ts
var PERMISSION_ENUM = {
  DEV: "dev",
  ADMIN: "admin",
  USER: "user"
};
var ALL_PERMISSIONS_LIST = Object.values(PERMISSION_ENUM);

// utils/config/env.ts
var dotenv = __toESM(require("dotenv"));
dotenv.config();
var CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  GRAPHQL_INSTROSPECTION: process.env.GRAPHQL_INSTROSPECTION || "true",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "",
  S3_REGION: process.env.S3_REGION || "",
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || "",
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || "",
  S3_ENDPOINT: process.env.S3_ENDPOINT || "",
  S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE || "",
  SERVER_CORS_HEADERS: process.env.SERVER_CORS_HEADERS || '"Origin, X-Requested-With, Content-Type, Accept, Authorization"',
  SERVER_CORS_URL: process.env.SERVER_CORS_URL || '"*"',
  SESSION_SECRET: process.env.SESSION_SECRET || '"secretashdasifhjldgjaisjflsjkasldfklaskdjf"',
  MAILER_BREVO_API_KEY: process.env.MAILER_BREVO_API_KEY || "secret",
  MAILER_NAME: process.env.MAILER_NAME || "mailer",
  MAILER_EMAILADDRESS: process.env.MAILER_EMAILADDRESS || "mailer@test.com",
  BREVO_TEMPLATE_NEW_ACCOUNT: process.env.BREVO_TEMPLATE_NEW_ACCOUNT || "4",
  BREVO_TEMPLATE_RESET_PASSWORD: process.env.BREVO_TEMPLATE_RESET_PASSWORD || "6",
  BREVO_TEMPLATE_2FA_LOGIN: process.env.BREVO_TEMPLATE_2FA_LOGIN || "7",
  BREVO_TEMPLATE_EVENT_REMINDER: process.env.BREVO_TEMPLATE_EVENT_REMINDER || "8",
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  PAGE_URL: process.env.PAGE_URL || "http://localhost:300",
  RUN_CRON_JOB: process.env.RUN_CRON_JOB || "true",
  NEW_ACCOUNT_URL: process.env.NEW_ACCOUNT_URL || "/new-account",
  PAGE_RESET_PASSWORD_URL: process.env.PAGE_RESET_PASSWORD_URL || "/reset-password",
  JWT_SECRET: process.env.JWT_SECRET || "secret"
};

// auth.ts
var sessionSecret = CONFIG.SESSION_SECRET;
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "id name createdAt role",
  secretField: "adminPassword",
  initFirstItem: {
    fields: ["name", "email", "adminPassword"],
    itemData: {
      role: PERMISSION_ENUM.DEV
    }
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// dbConfig.ts
var dbConfig = {
  provider: "postgresql",
  url: CONFIG.DATABASE_URL
};
var dbConfig_default = dbConfig;

// fileConfig.ts
var s3FilesStorageConfig = {
  kind: "s3",
  type: "file",
  bucketName: CONFIG.S3_BUCKET_NAME,
  region: CONFIG.S3_REGION,
  accessKeyId: CONFIG.S3_ACCESS_KEY_ID,
  secretAccessKey: CONFIG.S3_SECRET_ACCESS_KEY,
  signed: { expiry: 5e3 },
  endpoint: CONFIG.S3_ENDPOINT,
  forcePathStyle: CONFIG.S3_FORCE_PATH_STYLE === "true"
};
var s3FilesConfigKey = "my_S3_files";
var fileConfig_default = s3FilesStorageConfig;

// graphql/extensions/auth.ts
var import_core = require("@keystone-6/core");

// server/services/auth/login.ts
var import_bcrypt = require("bcrypt");
async function authenticateUser(args, context) {
  return validateUserViaPassword(args, context);
}
async function validateUserViaPassword(args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
    include: {
      localAuth: true
    }
  });
  if (!user)
    return null;
  if (!user.localAuth)
    return null;
  const passHash = user.localAuth.password;
  const validate = (0, import_bcrypt.compareSync)(args.password, passHash);
  if (!validate)
    return null;
  return {
    type: "auth",
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? "",
    createdAt: /* @__PURE__ */ new Date()
  };
}

// server/services/auth/reset_password.ts
var import_bcrypt2 = require("bcrypt");

// server/services/jwt/index.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
async function jwt_sign(data, options) {
  const token = import_jsonwebtoken.default.sign(data, CONFIG.JWT_SECRET, options);
  return token;
}
async function jwt_verify(token) {
  const data = import_jsonwebtoken.default.verify(token, CONFIG.JWT_SECRET);
  return data;
}

// server/services/mail/index.ts
var SibApiV3Sdk = __toESM(require("sib-api-v3-typescript"));
async function sendEmailByBrevoTemplate(to, subject, templateId, params) {
  const messageId = await _sendEmailRoutine(
    {
      to,
      cc: "",
      subject,
      template: templateId
    },
    {
      templateParams: params
    }
  );
  return messageId;
}
async function _sendEmailRoutine(options, extra) {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = CONFIG.MAILER_BREVO_API_KEY;
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = options.subject;
  if (options.template) {
    sendSmtpEmail.templateId = Number(options.template);
  } else if (options.html) {
    sendSmtpEmail.htmlContent = options.html;
  }
  sendSmtpEmail.sender = {
    name: CONFIG.MAILER_NAME,
    email: CONFIG.MAILER_EMAILADDRESS
  };
  sendSmtpEmail.to = [
    {
      email: options.to
    }
  ];
  if (options.cc)
    sendSmtpEmail.cc = [{ email: options.cc }];
  if (extra?.templateParams) {
    sendSmtpEmail.params = extra?.templateParams;
  }
  return await apiInstance.sendTransacEmail(sendSmtpEmail);
}

// server/services/auth/reset_password.ts
async function resetPasswordForNewUser(args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });
  if (!user)
    return;
  const resetPassword2 = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? "",
    type: "reset-password",
    createdAt: /* @__PURE__ */ new Date()
  };
  const token = await jwt_sign(resetPassword2, {
    expiresIn: "3d"
  });
  await sendEmailByBrevoTemplate(
    user.email,
    "New Account Setup",
    CONFIG.BREVO_TEMPLATE_NEW_ACCOUNT,
    {
      username: user.name + (user.lastName ? ` ${user.lastName}` : "") || user.email,
      reset_url: `${CONFIG.PAGE_URL}${CONFIG.PAGE_RESET_PASSWORD_URL}?token=${token}`
    }
  );
  console.log("[System] Reset password for new user:", user.email);
}
async function requestResetPassword(email, expiry = "1h", config3) {
  const user = await config3.prisma.user.findUnique({
    where: { email }
  });
  if (!user)
    return;
  const resetPassword2 = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? "",
    type: "reset-password",
    createdAt: /* @__PURE__ */ new Date()
  };
  const token = await jwt_sign(resetPassword2, {
    expiresIn: expiry
  });
  await sendEmailByBrevoTemplate(
    user.email,
    "Reset Password",
    CONFIG.BREVO_TEMPLATE_RESET_PASSWORD,
    {
      username: user.name + (user.lastName ? ` ${user.lastName}` : "") || user.email,
      time_date: (/* @__PURE__ */ new Date()).toLocaleString(),
      reset_url: `${CONFIG.PAGE_URL}${CONFIG.PAGE_RESET_PASSWORD_URL}?token=${token}`
    }
  );
}
async function resetPassword(token, newPassword, context) {
  const decoded = await jwt_verify(token);
  if (!decoded)
    return;
  if (decoded.type !== "reset-password")
    return;
  const hashedPassword = (0, import_bcrypt2.hashSync)(newPassword, 10);
  const userObj = await context.prisma.user.findUnique({
    where: { id: decoded.id },
    include: {
      localAuth: true
    }
  });
  if (!userObj)
    throw new Error("User not found");
  if (!userObj.localAuth) {
    await context.prisma.user.update({
      where: { id: decoded.id },
      data: {
        localAuth: {
          create: {
            password: hashedPassword
          }
        }
      }
    });
  }
  await context.prisma.user.update({
    where: { id: decoded.id },
    data: {
      localAuth: {
        update: {
          password: hashedPassword
        }
      }
    }
  });
}
async function changePassword(user, passwordInput, context) {
  const userObj = await context.prisma.user.findUnique({
    where: { id: user.id },
    include: {
      localAuth: true
    }
  });
  if (!userObj)
    throw new Error("User not found");
  if (!userObj.localAuth) {
    const hashedPassword = (0, import_bcrypt2.hashSync)(passwordInput.newPassword, 10);
    await context.prisma.userLocalAuth.create({
      data: {
        password: hashedPassword,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });
    return;
  }
}

// graphql/extensions/auth.ts
var gqlNames = {
  ItemAuthenticationWithPasswordSuccess: "ClientItemAuthenticationWithPasswordSuccess",
  ItemAuthenticationWithPasswordFailure: "ClientItemAuthenticationWithPasswordFailure",
  ItemAuthenticationWithPasswordResult: "ClientItemAuthenticationWithPasswordResult"
};
var listKey = "User";
var identityField = "email";
var secretField = "password";
var clientAuthGraphqlExtension = import_core.graphql.extend((base) => {
  const ItemAuthenticationWithPasswordSuccess = import_core.graphql.object()({
    name: gqlNames.ItemAuthenticationWithPasswordSuccess,
    fields: {
      sessionToken: import_core.graphql.field({ type: import_core.graphql.nonNull(import_core.graphql.String) }),
      item: import_core.graphql.field({ type: import_core.graphql.nonNull(base.object(listKey)) })
    }
  });
  const ItemAuthenticationWithPasswordFailure = import_core.graphql.object()({
    name: gqlNames.ItemAuthenticationWithPasswordFailure,
    fields: {
      message: import_core.graphql.field({ type: import_core.graphql.nonNull(import_core.graphql.String) })
    }
  });
  const AuthenticationResult = import_core.graphql.union({
    name: gqlNames.ItemAuthenticationWithPasswordResult,
    types: [
      ItemAuthenticationWithPasswordSuccess,
      ItemAuthenticationWithPasswordFailure
    ],
    resolveType(val) {
      if ("sessionToken" in val) {
        return gqlNames.ItemAuthenticationWithPasswordSuccess;
      }
      return gqlNames.ItemAuthenticationWithPasswordFailure;
    }
  });
  return {
    mutation: {
      authclient_login: import_core.graphql.field({
        type: AuthenticationResult,
        args: {
          [identityField]: import_core.graphql.arg({
            type: import_core.graphql.nonNull(import_core.graphql.String)
          }),
          [secretField]: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) })
        },
        async resolve(_, { [identityField]: identity, [secretField]: secret }, context) {
          if (!context.sessionStrategy) {
            throw new Error("No session implementation available on context");
          }
          const user = await context.prisma.user.findUnique({
            where: { [identityField]: identity }
          });
          if (!user) {
            return { code: "FAILURE", message: "Authentication failed." };
          }
          const verifyResult = await authenticateUser(
            {
              email: identity,
              password: secret
            },
            context
          );
          if (!verifyResult) {
            return { code: "FAILURE", message: "Authentication failed." };
          }
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey: "User",
              itemId: verifyResult.id,
              data: {
                role: verifyResult.role,
                id: verifyResult.id,
                name: verifyResult.name,
                createdAt: verifyResult.createdAt.toISOString()
              }
            },
            context
          });
          if (typeof sessionToken !== "string" || sessionToken.length === 0) {
            return { code: "FAILURE", message: "Failed to start session." };
          }
          return { sessionToken, item: user };
        }
      }),
      authclient_register: import_core.graphql.field({
        type: import_core.graphql.Boolean,
        args: {
          email: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) }),
          firstName: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) }),
          lastName: import_core.graphql.arg({ type: import_core.graphql.String }),
          password: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) })
        },
        async resolve(_, { email, firstName, lastName, password: password2 }, context) {
          const user = await context.prisma.user.create({
            data: {
              email,
              name: firstName,
              lastName: lastName || ""
            }
          });
          if (!user) {
            return false;
          }
          try {
            await changePassword(
              {
                id: user.id
              },
              {
                oldPassword: "",
                newPassword: password2
              },
              context
            );
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        }
      }),
      authclient_requestPasswordReset: import_core.graphql.field({
        type: import_core.graphql.Boolean,
        args: {
          email: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) })
        },
        async resolve(_, { email }, context) {
          try {
            await requestResetPassword(email, "1h", context);
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        }
      }),
      authclient_newAccountPasswordReset: import_core.graphql.field({
        type: import_core.graphql.Boolean,
        args: {
          email: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) })
        },
        async resolve(_, { email }, context) {
          try {
            await resetPasswordForNewUser(
              {
                email
              },
              context
            );
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        }
      }),
      authclient_resetPassword: import_core.graphql.field({
        type: import_core.graphql.Boolean,
        args: {
          token: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) }),
          password: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) })
        },
        async resolve(_, { token, password: password2 }, context) {
          try {
            await resetPassword(token, password2, context);
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        }
      }),
      authclient_changePassword: import_core.graphql.field({
        type: import_core.graphql.Boolean,
        args: {
          oldPassword: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) }),
          newPassword: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.String) })
        },
        async resolve(_, { oldPassword, newPassword }, context) {
          try {
            if (!context.session?.data.id)
              throw new Error("No user session");
            await changePassword(
              {
                id: context.session?.data.id
              },
              {
                oldPassword,
                newPassword
              },
              context
            );
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        }
      })
    }
  };
});

// graphql/extensions/test.ts
var import_core2 = require("@keystone-6/core");
var testGraphqlExtension = import_core2.graphql.extend((base) => {
  return {
    query: {
      test: import_core2.graphql.field({
        type: import_core2.graphql.String,
        resolve() {
          return "Hello world!";
        }
      })
    },
    mutation: {
      test: import_core2.graphql.field({
        type: import_core2.graphql.String,
        args: {
          email: import_core2.graphql.arg({ type: import_core2.graphql.String })
        },
        async resolve(source, { email }, context) {
          const user = await context.db.User.findOne({
            where: {
              email
            }
          });
          return `Hello ${user?.name}!`;
        }
      })
    }
  };
});

// graphql/extensions/index.ts
function boostrapGraphqlExtensions(schema) {
  let _schema = schema;
  const extensionList = [testGraphqlExtension, clientAuthGraphqlExtension];
  extensionList.forEach((extension) => {
    _schema = extension(_schema);
  });
  return _schema;
}

// imageConfig.ts
var s3ImageStorageConfig = {
  kind: "s3",
  type: "image",
  bucketName: CONFIG.S3_BUCKET_NAME,
  region: CONFIG.S3_REGION,
  accessKeyId: CONFIG.S3_ACCESS_KEY_ID,
  secretAccessKey: CONFIG.S3_SECRET_ACCESS_KEY,
  signed: { expiry: 5e3 },
  endpoint: CONFIG.S3_ENDPOINT,
  forcePathStyle: CONFIG.S3_FORCE_PATH_STYLE === "true"
};
var s3ImageConfigKey = "my_S3_images";
var imageConfig_default = s3ImageStorageConfig;

// schema/PostData.ts
var import_core3 = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var postDataList = {
  Post: (0, import_core3.list)({
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      content: (0, import_fields.text)({ validation: { isRequired: true } }),
      tags: (0, import_fields.relationship)({ ref: "PostTag.posts", many: true }),
      coverImage: (0, import_fields.image)({
        storage: s3ImageConfigKey
      }),
      author: (0, import_fields.relationship)({ ref: "User.posts", many: false })
    },
    access: import_access.allowAll
  }),
  PostTag: (0, import_core3.list)({
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      posts: (0, import_fields.relationship)({ ref: "Post.tags", many: true })
    },
    access: import_access.allowAll
  })
};

// schema/UserData.ts
var import_core4 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var import_zod = require("zod");

// graphql/operations.ts
var LoginDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "mutation", "name": { "kind": "Name", "value": "Login" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "email" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "String" } } } }, { "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "password" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "String" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "authenticateUserWithPassword" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "email" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "email" } } }, { "kind": "Argument", "name": { "kind": "Name", "value": "adminPassword" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "password" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "__typename" } }, { "kind": "InlineFragment", "typeCondition": { "kind": "NamedType", "name": { "kind": "Name", "value": "UserAuthenticationWithPasswordSuccess" } }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "sessionToken" } }] } }] } }] } }] };

// utils/functions/deepMerge.ts
var deepMerge = (objects) => {
  const isObject = (obj) => obj && typeof obj === "object";
  const combinedObject = objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = deepMerge([pVal, oVal]);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
  return combinedObject;
};

// common/access/definitions/access.ts
var accessConfig = (generatorArgs) => {
  const globalMiddleware = (operation) => {
    if (generatorArgs.isAuthed) {
      if (!operation.context.session?.itemId) {
        throw new Error("Not Authenticated");
      }
    }
    const superAccessRoles = [
      ...generatorArgs.superAccess || [],
      "dev" /* Dev */
    ];
    if (superAccessRoles.includes(operation.session.data.role)) {
      return true;
    }
    return false;
  };
  const baseConfig = {
    operation: {
      query: (args) => {
        let checkerFunction = generatorArgs.operations.read || generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      create: (args) => {
        let checkerFunction = generatorArgs.operations.create || generatorArgs.operations.write || generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      update: (args) => {
        let checkerFunction = generatorArgs.operations.update || generatorArgs.operations.write || generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      delete: (args) => {
        let checkerFunction = generatorArgs.operations.delete || generatorArgs.operations.write || generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      }
    },
    filter: {
      query: (args) => {
        let checkerFunction = generatorArgs.filter.read || generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      update: (args) => {
        let checkerFunction = generatorArgs.filter.update || generatorArgs.filter.write || generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      },
      delete: (args) => {
        let checkerFunction = generatorArgs.filter.delete || generatorArgs.filter.write || generatorArgs.operations.all;
        if (!checkerFunction) {
          checkerFunction = () => true;
        }
        return globalMiddleware(args) || checkerFunction(args);
      }
    },
    ...generatorArgs.item ? {
      item: {
        create: (args) => {
          let checkerFunction = generatorArgs.item.create || generatorArgs.item.write || generatorArgs.operations.all;
          if (!checkerFunction) {
            checkerFunction = () => true;
          }
          return globalMiddleware(args) || checkerFunction(args);
        },
        update: (args) => {
          let checkerFunction = generatorArgs.item.create || generatorArgs.item.write || generatorArgs.operations.all;
          if (!checkerFunction) {
            checkerFunction = () => true;
          }
          return globalMiddleware(args) || checkerFunction(args) || generatorArgs.operations.all;
        },
        delete: (args) => {
          let checkerFunction = generatorArgs.item.create || generatorArgs.item.write || generatorArgs.operations.all;
          if (!checkerFunction) {
            checkerFunction = () => true;
          }
          return globalMiddleware(args) || checkerFunction(args);
        }
      }
    } : {}
  };
  return deepMerge([baseConfig, generatorArgs.extraConfig || {}]);
};

// common/access/definitions/templates.ts
var hasRole = (args) => (operation) => {
  return args.roles.includes(operation.session?.data?.role);
};
var isOwner = (args) => (operation) => {
  const userID = operation.session?.data?.id;
  if (!userID) {
    return false;
  }
  return {
    [args?.itemIDKey || "id"]: {
      equals: userID
    }
  };
};
var sequential = (checkers) => (operation) => {
  for (let checker of checkers) {
    const check = checker(operation);
    if (check) {
      return check;
    }
  }
  return false;
};
var allow = () => true;
var checkRole = (role, allowedRoles) => {
  return allowedRoles.includes(role);
};

// schema/UserData.ts
var userDataList = {
  User: (0, import_core4.list)({
    fields: {
      name: (0, import_fields2.text)({ validation: { isRequired: true } }),
      lastName: (0, import_fields2.text)(),
      displayName: (0, import_fields2.virtual)({
        field: import_core4.graphql.field({
          type: import_core4.graphql.String,
          async resolve(item, {}, context) {
            return `${item.name} ${item.lastName}`.trim();
          }
        })
      }),
      email: (0, import_fields2.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
        // hooks: {
        //   resolveInput: async ({ inputData }) => {
        //     if (!inputData.email) {
        //       return `user-${Math.random().toString(36).substring(7)}@client`;
        //     }
        //     return inputData.email;
        //   },
        // },
      }),
      adminPassword: (0, import_fields2.password)({
        validation: { isRequired: false },
        hooks: {
          validateInput: async ({
            resolvedData,
            context,
            addValidationError
          }) => {
            const role = context?.session?.data?.role;
            if (!resolvedData.adminPassword) {
              return;
            }
            if (checkRole(role, [PERMISSION_ENUM.DEV])) {
              return;
            }
            const userCount = await context.query.User.count({});
            if (userCount == 0) {
              return;
            }
            addValidationError("You are not allowed to modify this");
          }
        }
      }),
      localAuth: (0, import_fields2.relationship)({
        ref: "UserLocalAuth.user",
        many: false,
        access: import_access2.denyAll
      }),
      avatar: (0, import_fields2.image)({
        storage: s3ImageConfigKey
      }),
      role: (0, import_fields2.select)({
        type: "enum",
        options: [
          { label: "Dev", value: PERMISSION_ENUM.DEV },
          { label: "Admin", value: PERMISSION_ENUM.ADMIN },
          { label: "User", value: PERMISSION_ENUM.USER }
        ],
        defaultValue: PERMISSION_ENUM.USER,
        hooks: {
          validateInput: async ({
            resolvedData,
            context,
            addValidationError
          }) => {
            const role = context?.session?.data?.role;
            const selectedRole = resolvedData?.role?.toString() ?? "";
            if (!selectedRole) {
              return;
            }
            if (checkRole(role, [PERMISSION_ENUM.DEV])) {
              return;
            }
            if (checkRole(role, [PERMISSION_ENUM.DEV]) && checkRole(selectedRole, [PERMISSION_ENUM.DEV])) {
              return;
            }
            if (checkRole(role, [PERMISSION_ENUM.ADMIN]) && !checkRole(selectedRole, [PERMISSION_ENUM.DEV])) {
              return;
            }
            const userCount = await context.query.User.count({});
            if (userCount == 0) {
              return;
            }
            addValidationError("You are not allowed to change the role");
          }
        }
      }),
      groups: (0, import_fields2.relationship)({
        ref: "Group.members",
        many: true
      }),
      posts: (0, import_fields2.relationship)({
        ref: "Post.author",
        many: true
      }),
      createdAt: (0, import_fields2.timestamp)({
        defaultValue: { kind: "now" }
      })
    },
    access: accessConfig({
      isAuthed: true,
      // superAccess: [PERMISSION_ENUM.ADMIN],
      operations: {
        read: allow,
        write: hasRole({ roles: [PERMISSION_ENUM.ADMIN] }),
        update: allow
      },
      filter: {
        read: allow,
        write: sequential([
          hasRole({ roles: [PERMISSION_ENUM.ADMIN] }),
          isOwner()
        ])
      }
    }),
    hooks: {
      validateDelete: async ({ item, context, addValidationError }) => {
        const userCount = await context.query.User.count({});
        if (userCount == 1) {
          return addValidationError("You cannot delete the only user");
        }
        const userRole = context.session?.data?.role;
        if (!userRole) {
          return addValidationError("You are not allowed to delete this");
        }
        if (checkRole(userRole, [PERMISSION_ENUM.DEV])) {
          return;
        }
        if (item.role === PERMISSION_ENUM.DEV) {
          return addValidationError("You are not allowed to delete this");
        }
      },
      afterOperation: async ({ operation, context, item }) => {
        if (operation === "create") {
          if (!item.role)
            return;
          const check = import_zod.z.string().email().safeParse(item.email);
          if (!check.success) {
            return;
          }
          if (checkRole(item.role, [PERMISSION_ENUM.DEV])) {
            return;
          }
          await resetPasswordForNewUser(
            {
              email: item.email
            },
            context
          );
          console.log(`[System] Reset password for new user: ${item.email}`);
        }
      }
    }
  }),
  UserLocalAuth: (0, import_core4.list)({
    fields: {
      password: (0, import_fields2.text)(),
      twoFaEmail: (0, import_fields2.text)(),
      twoFaEmailSecret: (0, import_fields2.text)(),
      twoFaEmailLastSent: (0, import_fields2.timestamp)(),
      user: (0, import_fields2.relationship)({
        ref: "User.localAuth",
        many: false
      })
    },
    access: import_access2.denyAll,
    graphql: {
      omit: true
    }
  }),
  Group: (0, import_core4.list)({
    fields: {
      name: (0, import_fields2.text)({ validation: { isRequired: true } }),
      members: (0, import_fields2.relationship)({
        ref: "User.groups",
        many: true
      })
    },
    access: accessConfig({
      isAuthed: true,
      operations: {
        all: allow
      },
      filter: {
        all: allow
      }
    })
  })
};

// schema/schema.ts
var lists = {
  ...userDataList,
  ...postDataList
};

// server/index.ts
var import_zod_to_openapi3 = require("@asteasolutions/zod-to-openapi");
var import_express = require("express");
var import_swagger_ui_express = __toESM(require("swagger-ui-express"));

// server/api/index.ts
var import_zod_to_openapi2 = require("@asteasolutions/zod-to-openapi");
var import_zod5 = require("zod");

// server/api/auth/index.ts
var import_zod3 = require("zod");

// server/declarations.ts
var import_zod2 = require("zod");
var import_zod_to_openapi = require("@asteasolutions/zod-to-openapi");
(0, import_zod_to_openapi.extendZodWithOpenApi)(import_zod2.z);
var NO_INPUT = import_zod2.z.object({});
var RouteDeclarationMetadata = class {
  method;
  inputParser;
  outputParser;
  accessConfig;
  // @ts-expect-error T does not satisfy the constraint 'z.ZodType<any>'.
  function;
  constructor(args) {
    this.method = args.method;
    this.function = args.func;
    this.inputParser = args.inputParser;
    this.accessConfig = args.accessConfig;
    this.outputParser = args.outputParser;
  }
};

// server/services/access/serverAccessConfig.ts
var serverAccessConfig = (generatorArgs) => {
  const globalMiddleware = (operation) => {
    if (!operation.session) {
      throw new Error("Not Authenticated");
    }
    if (!operation.context.session?.itemId) {
      throw new Error("Not Authenticated");
    }
    const superAccessRoles = [
      ...generatorArgs.superAccess || [],
      "dev" /* Dev */
    ];
    if (superAccessRoles.includes(operation.session.data.role)) {
      return true;
    }
    return false;
  };
  return (operation) => {
    let isAllowed = false;
    isAllowed = isAllowed || globalMiddleware(operation);
    for (const condition of generatorArgs.conditions || []) {
      if (isAllowed) {
        isAllowed = isAllowed || condition(operation);
      }
      if (!isAllowed) {
        break;
      }
    }
    return isAllowed;
  };
};
var hasRole2 = (args) => (operation) => {
  console.log(operation.session?.data?.role);
  return args.roles.includes(operation.session?.data?.role ?? "xxnorolexx");
};

// server/api/auth/index.ts
var authRouteDeclaration = {
  name: "/auth",
  routes: /* @__PURE__ */ new Map()
};
authRouteDeclaration.routes.set(
  "/signin",
  new RouteDeclarationMetadata({
    method: "post" /* POST */,
    inputParser: import_zod3.z.object({
      ["body" /* BODY */]: import_zod3.z.object({
        username: import_zod3.z.string(),
        password: import_zod3.z.string()
      })
    }),
    func: async ({
      context: { graphql: graphql4 },
      inputData: {
        ["body" /* BODY */]: { username, password: password2 }
      },
      res
    }) => {
      const request = await graphql4.run({
        query: LoginDocument,
        variables: {
          email: username,
          password: password2
        }
      });
      if (request.authenticateUserWithPassword?.__typename == "UserAuthenticationWithPasswordSuccess") {
        return {
          token: request.authenticateUserWithPassword.sessionToken
        };
      } else {
        res.status(401).json({
          error: "Invalid credentials"
        });
        return;
      }
    }
  })
);
authRouteDeclaration.routes.set(
  "/test/:id/:id2",
  new RouteDeclarationMetadata({
    method: "get" /* GET */,
    accessConfig: serverAccessConfig({
      conditions: [hasRole2({ roles: [PERMISSION_ENUM.ADMIN] })]
    }),
    inputParser: import_zod3.z.object({
      ["params" /* PARAMS */]: import_zod3.z.object({
        id: import_zod3.z.preprocess((val) => parseInt(val), import_zod3.z.number()),
        id2: import_zod3.z.preprocess((val) => parseInt(val), import_zod3.z.number())
      }),
      ["query" /* QUERY */]: import_zod3.z.object({
        name: import_zod3.z.string()
      }),
      ["headers" /* HEADERS */]: import_zod3.z.object({
        whoosh: import_zod3.z.string().default("whoosh")
      })
    }),
    func: async ({ inputData, res }) => {
      return inputData;
    }
  })
);
authRouteDeclaration.routes.set(
  "/profile_picture",
  new RouteDeclarationMetadata({
    method: "get" /* GET */,
    accessConfig: serverAccessConfig({}),
    inputParser: NO_INPUT,
    func: async ({ context: { session: session2, prisma, images }, res }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: session2?.data?.id
        }
      });
      if (!user) {
        return res.status(404).json({
          error: "User not found"
        });
      }
      if (!user.avatar_id || !user.avatar_extension) {
        return res.status(404).json({
          error: "Profile picture not found"
        });
      }
      const image3 = await images(s3ImageConfigKey).getUrl(
        user.avatar_id,
        user.avatar_extension
      );
      return {
        session: session2,
        image: image3
      };
    }
  })
);

// server/api/health/index.ts
var import_zod4 = require("zod");

// server/services/s3/minio.ts
var import_minio = require("minio");
var minioClient = new import_minio.Client({
  endPoint: CONFIG.S3_ENDPOINT.replace("https://", "").replace("http://", ""),
  useSSL: true,
  accessKey: CONFIG.S3_ACCESS_KEY_ID,
  secretKey: CONFIG.S3_SECRET_ACCESS_KEY,
  region: CONFIG.S3_REGION,
  pathStyle: CONFIG.S3_FORCE_PATH_STYLE === "true"
});

// server/api/health/index.ts
var healthRouteDeclaration = {
  name: "/health",
  routes: /* @__PURE__ */ new Map()
};
healthRouteDeclaration.routes.set(
  "/",
  new RouteDeclarationMetadata({
    method: "get" /* GET */,
    inputParser: import_zod4.z.object({
      ["query" /* QUERY */]: import_zod4.z.object({
        database: import_zod4.z.preprocess((val) => {
          if (val === "true") {
            return true;
          } else {
            return false;
          }
        }, import_zod4.z.boolean().optional()).optional(),
        s3: import_zod4.z.preprocess((val) => {
          if (val === "true") {
            return true;
          } else {
            return false;
          }
        }, import_zod4.z.boolean().optional()).optional(),
        unified: import_zod4.z.preprocess((val) => {
          if (val === "true") {
            return true;
          } else {
            return false;
          }
        }, import_zod4.z.boolean().optional()).optional()
      })
    }),
    func: async ({
      context: { prisma },
      inputData: {
        ["query" /* QUERY */]: { database, s3, unified }
      },
      res
    }) => {
      const serverStatus = true;
      let databaseStatus = false;
      let s3Status = false;
      if (database) {
        try {
          await await prisma.$queryRaw`SELECT 1`;
          databaseStatus = true;
        } catch (e) {
          databaseStatus = false;
        }
      }
      if (s3) {
        try {
          await minioClient.listBuckets();
          s3Status = true;
        } catch (e) {
          s3Status = false;
        }
      }
      let unifiedStatus = true;
      if (database) {
        unifiedStatus = unifiedStatus && databaseStatus;
      }
      if (s3) {
        unifiedStatus = unifiedStatus && s3Status;
      }
      if (unified) {
        if (unifiedStatus) {
          res.status(200).send({
            server: serverStatus,
            database: database ? databaseStatus : void 0,
            s3: s3 ? s3Status : void 0
          });
        } else {
          res.status(500).send({
            error: "One or more systems are down",
            server: serverStatus,
            database: database ? databaseStatus : void 0,
            s3: s3 ? s3Status : void 0
          });
        }
      } else {
        res.status(200).send({
          server: serverStatus,
          database: database ? databaseStatus : void 0,
          s3: s3 ? s3Status : void 0
        });
      }
    }
  })
);

// server/api/index.ts
(0, import_zod_to_openapi2.extendZodWithOpenApi)(import_zod5.z);
var routeList = [authRouteDeclaration, healthRouteDeclaration];

// server/services/middleware/errorHandler.ts
var devErrorHandler = (err, req, res, next) => {
  err.stack = err.stack || "";
  const status = err.status || 500;
  const error = { message: err.message };
  res.status(status);
  return res.json({ status, error });
};

// server/index.ts
var registry = new import_zod_to_openapi3.OpenAPIRegistry();
var MAIN_API_ROUTE = "/api";
function convertExpressRouteToOpenApiRoute(route) {
  return route.replace(/:(\w+)/g, "{$1}");
}
function implementRouteDeclaration(mainRouter, commonContext, data) {
  const router = (0, import_express.Router)();
  for (const [route, routeData] of data.routes) {
    const method = routeData.method;
    registry.registerPath({
      method,
      path: convertExpressRouteToOpenApiRoute(
        MAIN_API_ROUTE + data.name + route
      ),
      tags: [data.name],
      security: routeData.accessConfig ? [{ bearerAuth: [] }] : void 0,
      request: {
        query: routeData.inputParser.pick({
          ["query" /* QUERY */]: true
        }).shape?.query,
        params: routeData.inputParser.pick({
          ["params" /* PARAMS */]: true
        }).shape?.params,
        headers: routeData.inputParser.pick({
          ["headers" /* HEADERS */]: true
        }).shape?.headers,
        body: ["get"].includes(method) ? void 0 : {
          content: {
            "application/json": {
              schema: routeData.inputParser.pick({
                ["body" /* BODY */]: true
              }).shape?.body
            }
          }
        }
      },
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: routeData.outputParser ? routeData.outputParser : {}
            }
          }
        }
      }
    });
    router[method](route, async (req, res, next) => {
      const context = await commonContext.withRequest(req, res);
      const parsedData = routeData.inputParser.safeParse({
        ["query" /* QUERY */]: req.query,
        ["body" /* BODY */]: req.body,
        ["params" /* PARAMS */]: req.params,
        ["headers" /* HEADERS */]: req.headers
      });
      if (!parsedData.success)
        return res.status(400).json({ error: parsedData.error });
      const session2 = context.session;
      if (routeData.accessConfig) {
        const accessResult = routeData.accessConfig({
          context,
          session: session2,
          operation: method
        });
        if (!accessResult)
          return res.status(403).json({ error: "Forbidden" });
      }
      try {
        const returnValue = await routeData.function({
          context,
          inputData: parsedData.data,
          req,
          res
        });
        if (returnValue) {
          if (routeData.outputParser) {
            const outputData = routeData.outputParser.safeParse(returnValue);
            if (!outputData.success)
              return res.status(500).json({ error: outputData.error });
            return res.json(outputData.data);
          } else {
            return res.json(returnValue);
          }
        }
      } catch (error) {
        next(error);
      }
    });
  }
  mainRouter.use(data.name, router);
}
function bootstrapExpress(app, commonContext) {
  app.use((0, import_express.json)());
  app.use(devErrorHandler);
  const mainRouter = (0, import_express.Router)();
  for (const routeData of routeList) {
    implementRouteDeclaration(mainRouter, commonContext, routeData);
  }
  const definitions = registry.definitions;
  const generator = new import_zod_to_openapi3.OpenApiGeneratorV3(definitions);
  const document = generator.generateDocument({
    info: {
      title: "Server API",
      version: "1.0.0"
    },
    openapi: "3.0.0"
    // add bearerAuth security definition
  });
  document.components["securitySchemes"] = {
    bearerAuth: {
      type: "http",
      in: "header",
      name: "Authorization",
      description: "Bearer token to access these api endpoints",
      scheme: "bearer",
      bearerFormat: "JWT"
    }
  };
  app.use("/api/rest", import_swagger_ui_express.default.serve, import_swagger_ui_express.default.setup(document));
  app.use(MAIN_API_ROUTE, mainRouter);
}

// keystone.ts
(0, import_zod_to_openapi4.extendZodWithOpenApi)(import_zod6.z);
var MEM_CACHE = class {
  cache = /* @__PURE__ */ new Map();
  async set(key, value) {
    this.cache.set(key, value);
  }
  async get(key) {
    const val = this.cache.get(key);
    if (!val) {
      return void 0;
    }
    const valParsed = JSON.parse(val);
    if (valParsed.cacheTime + valParsed.cachePolicy.maxAge * 1e3 < Date.now()) {
      this.cache.delete(key);
      return void 0;
    }
    return this.cache.get(key);
  }
  async delete(key) {
    this.cache.delete(key);
  }
  processor = {
    set: this.set.bind(this),
    get: this.get.bind(this),
    delete: this.delete.bind(this)
  };
};
var MEM_CACHE_INSTANCE = new MEM_CACHE();
var keystoneConfig = (0, import_core5.config)({
  db: dbConfig_default,
  lists,
  session,
  graphql: {
    playground: CONFIG.GRAPHQL_INSTROSPECTION === "true",
    apolloConfig: {
      introspection: CONFIG.GRAPHQL_INSTROSPECTION === "true",
      // WARN: This is a security risk, should be configured properly, but cant be done in this project
      csrfPrevention: false,
      plugins: [
        // ApolloServerPluginCacheControl({ defaultMaxAge: 1 }),
        (0, import_server_plugin_response_cache.default)({
          sessionId: async ({ request }) => {
            const session2 = request?.http?.headers.get("Authorization") || null;
            return session2;
          }
        })
      ],
      cache: MEM_CACHE_INSTANCE.processor
    }
  },
  server: {
    cors: {
      origin: CONFIG.SERVER_CORS_URL.split(",")
      // secure: true,
    },
    extendExpressApp: bootstrapExpress
  },
  extendGraphqlSchema: boostrapGraphqlExtensions,
  storage: {
    [s3FilesConfigKey]: fileConfig_default,
    [s3ImageConfigKey]: imageConfig_default
  }
});
var keystone_default = withAuth(keystoneConfig);
//# sourceMappingURL=config.js.map
