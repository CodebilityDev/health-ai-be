import { hashSync } from "bcrypt";
import { jwt_sign, jwt_verify } from "../../../common/jwt";
import { sendEmailByBrevoTemplate } from "../../../common/mail";
import { GlobalContext } from "../../../common/types";
import { CONFIG } from "../../../utils/config/env";
import { IChangePassword, IUserJwt } from "./UserJWT.dto";

export async function resetPasswordForNewUser(
  args: { email: string },
  context: GlobalContext,
) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) return;

  const resetPassword: IUserJwt = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? "",
    type: "reset-password",
    createdAt: new Date(),
  };

  const token = await jwt_sign(resetPassword, {
    expiresIn: "3d",
  });

  // send email
  await sendEmailByBrevoTemplate(
    user.email,
    "New Account Setup",
    CONFIG.BREVO_TEMPLATE_NEW_ACCOUNT,
    {
      username:
        user.name + (user.lastName ? ` ${user.lastName}` : "") || user.email,
      reset_url: `${CONFIG.PAGE_URL}${CONFIG.PAGE_RESET_PASSWORD_URL}?token=${token}`,
    },
  );

  console.log("[System] Reset password for new user:", user.email);
}

export async function requestResetPassword(
  email: string,
  expiry = "1h",
  config: GlobalContext,
) {
  const user = await config.prisma.user.findUnique({
    where: { email },
  });
  if (!user) return;

  const resetPassword: IUserJwt = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? "",
    type: "reset-password",
    createdAt: new Date(),
  };

  const token = await jwt_sign(resetPassword, {
    expiresIn: expiry,
  });

  // send email
  await sendEmailByBrevoTemplate(
    user.email,
    "Reset Password",
    CONFIG.BREVO_TEMPLATE_RESET_PASSWORD,
    {
      username:
        user.name + (user.lastName ? ` ${user.lastName}` : "") || user.email,
      time_date: new Date().toLocaleString(),
      reset_url: `${CONFIG.PAGE_URL}${CONFIG.PAGE_RESET_PASSWORD_URL}?token=${token}`,
    },
  );
}

export async function resetPassword(
  token: string,
  newPassword: string,
  context: GlobalContext,
) {
  const decoded = (await jwt_verify(token)) as IUserJwt;
  if (!decoded) return;
  if (decoded.type !== "reset-password") return;

  const hashedPassword = hashSync(newPassword, 10);

  const userObj = await context.prisma.user.findUnique({
    where: { id: decoded.id },
    include: {
      localAuth: true,
    },
  });
  if (!userObj) throw new Error("User not found");

  if (!userObj.localAuth) {
    await context.prisma.user.update({
      where: { id: decoded.id },
      data: {
        localAuth: {
          create: {
            password: hashedPassword,
          },
        },
      },
    });
  }

  await context.prisma.user.update({
    where: { id: decoded.id },
    data: {
      localAuth: {
        update: {
          password: hashedPassword,
        },
      },
    },
  });
}

export async function changePassword(
  user: {
    id: string;
  },
  passwordInput: IChangePassword,
  context: GlobalContext,
) {
  const userObj = await context.prisma.user.findUnique({
    where: { id: user.id },
    include: {
      localAuth: true,
    },
  });
  if (!userObj) throw new Error("User not found");

  if (!userObj.localAuth) {
    // create local auth
    const hashedPassword = hashSync(passwordInput.newPassword, 10);

    await context.prisma.userLocalAuth.create({
      data: {
        password: hashedPassword,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return;
  }
}
