export const templateResetEmail = (args: {
  username: string;
  reset_url: string;
}) => /*html*/ `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Reset Password</title>
    </head>
    <body>
      <h1>Reset Password</h1>
      <p>
        Hi ${args.username},
      </p>
      <p>
        You have requested to reset your password. If you did not request this, please ignore this email.
      </p>
      <p>
        To reset your password, click the link below:
      </p>
      <a href="${args.reset_url}">Reset Password</a>
      <p>
        This link will expire in 3 days.
      </p>
      <p>
        If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:
      </p>
      <p>
        ${args.reset_url}
      </p>
      <p>
        Thanks,
      </p>
      <p>
        The Team
      </p>
    </body>
`;
