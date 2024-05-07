import { compareSync } from "bcrypt";
import { GlobalContext } from "../../../common/types";
import { IUserJwt } from "./UserJWT.dto";

export async function authenticateUser(
  args: { email: string; password: string },
  context: GlobalContext,
) {
  return validateUserViaPassword(args, context);
}

export async function validateUserViaPassword(
  args: {
    email: string;
    password: string;
  },
  context: GlobalContext,
): Promise<IUserJwt | null> {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
    include: {
      localAuth: true,
    },
  });

  // check if user exists
  if (!user) return null;

  // check if user can login with password
  if (!user.localAuth) return null;

  // validate password
  const passHash = user.localAuth.password;
  const validate = compareSync(args.password, passHash);
  if (!validate) return null;

  return {
    type: "auth",
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? "",
    createdAt: new Date(),
  };
}
