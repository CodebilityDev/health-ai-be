import * as SibApiV3Sdk from "sib-api-v3-typescript";
import { CONFIG } from "../../utils/config/env";

async function _sendBatchEmailTemplateRoutine(
  options: {
    subject: string;
    template?: string;
    html?: string;
    cc?: string;
  },
  messageVersions: SibApiV3Sdk.SendSmtpEmailMessageVersions[],
) {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // @ts-expect-error - this just works, if there's a way to properly type this, please let me know
  const apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = CONFIG.MAILER_BREVO_API_KEY;
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = options.subject;
  if (options.template) {
    sendSmtpEmail.templateId = Number(options.template);
  } else if (options.html) {
    sendSmtpEmail.htmlContent = options.html as string;
  }
  sendSmtpEmail.sender = {
    name: CONFIG.MAILER_NAME,
    email: CONFIG.MAILER_EMAILADDRESS,
  };
  if (options.cc) sendSmtpEmail.cc = [{ email: options.cc as string }];
  // sendSmtpEmail.bcc = [{ name: 'John Doe', email: 'example@example.com' }];
  // sendSmtpEmail.replyTo = { email: 'replyto@domain.com', name: 'John Doe' };
  // sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
  // sendSmtpEmail.params = {
  //   parameter: 'My param value',
  //   subject: 'New Subject',
  // };
  sendSmtpEmail.messageVersions = messageVersions;

  try {
    const res = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // Logger.log(res);
    return res;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export async function sendBatchEmailByBrevoTemplate(
  messageVersions: SibApiV3Sdk.SendSmtpEmailMessageVersions[],
  subject: string,
  templateId: string,
) {
  const messageId = await _sendBatchEmailTemplateRoutine(
    {
      subject: subject,
      template: templateId,
    },
    messageVersions,
  );

  return messageId;
}

export async function sendEmailByBrevoTemplate(
  to: string,
  subject: string,
  templateId: string,
  params: SibApiV3Sdk.SendSmtpEmail["params"],
) {
  const messageId = await _sendEmailRoutine(
    {
      to: to,
      cc: "",
      subject: subject,
      template: templateId,
    },
    {
      templateParams: params,
    },
  );

  return messageId;
}

async function _sendEmailRoutine(
  options: any,
  extra?: {
    templateParams?: SibApiV3Sdk.SendSmtpEmail["params"];
  },
) {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // @ts-expect-error - this just works, if there's a way to properly type this, please let me know
  const apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = CONFIG.MAILER_BREVO_API_KEY;
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = options.subject;
  if (options.template) {
    sendSmtpEmail.templateId = Number(options.template);
  } else if (options.html) {
    sendSmtpEmail.htmlContent = options.html as string;
  }
  sendSmtpEmail.sender = {
    name: CONFIG.MAILER_NAME,
    email: CONFIG.MAILER_EMAILADDRESS,
  };
  sendSmtpEmail.to = [
    {
      email: options.to as string,
    },
  ];
  if (options.cc) sendSmtpEmail.cc = [{ email: options.cc as string }];
  // sendSmtpEmail.bcc = [{ name: 'John Doe', email: 'example@example.com' }];
  // sendSmtpEmail.replyTo = { email: 'replyto@domain.com', name: 'John Doe' };
  // sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
  // sendSmtpEmail.params = {
  //   parameter: 'My param value',
  //   subject: 'New Subject',
  // };
  if (extra?.templateParams) {
    sendSmtpEmail.params = extra?.templateParams;
  }
  return await apiInstance.sendTransacEmail(sendSmtpEmail);
}
