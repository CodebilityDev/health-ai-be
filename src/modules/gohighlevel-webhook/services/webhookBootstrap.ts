import { ChatCompletion } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { CONFIG } from "~/common/env";
import { getCleanGPTResponse } from "~modules/chatai/openai/healthbot/services/getGPTResponse";
import { LeadContact } from "~modules/gohighlevel/service/getGHLContacts";
import { getGHLDetailedContact } from "~modules/gohighlevel/service/getGHLDetailedContact";
import { getGHLMe } from "~modules/gohighlevel/service/getGHLMe";
import { getGHLContactUpdate } from "~modules/gohighlevel/service/getGHLUpdateContact";

export const EnabledToCheck = {
  AutoReply: "enable_globalAutoReply",
  Welcome: "enable_globalWelcome",
  ContactUpdate: "enable_globalContactUpdate",
};

export const EnabledListAccessKey = {
  Welcome: "welcome",
  AutoReply: "autoReply",
};

export async function checkEnabled(args: {
  context: GlobalContext;
  groupID: string;
  contactID: string;
  toCheck: string;
  listAccessKey: string;
}) {
  // get group info
  const group = await args.context.prisma.group.findFirst({
    where: {
      id: args.groupID,
    },
  });

  if (!group) {
    return false;
  }

  const accessList = (group.contactConfigs as Record<string, string>) ?? {};

  // @ts-ignore
  if (group[args.toCheck]) {
    // check if globalAutoReply is enabled
    // if contactID is in blacklist, return false
    if (
      accessList[args.contactID]?.includes(`${args.listAccessKey}_blacklist`)
    ) {
      return false;
    }
    return true;
  } else {
    // if contactID is not in whitelist, return false
    if (
      accessList[args.contactID]?.includes(`${args.listAccessKey}_whitelist`)
    ) {
      return true;
    }
    return false;
  }
}

export async function checkDNDMessage(args: {
  context: GlobalContext;
  groupID: string;
  contactInfo: LeadContact;
  message: string;
}) {
  // get group info
  const group = await args.context.prisma.group.findFirst({
    where: {
      id: args.groupID,
    },
    include: {
      aiKey: true,
    },
  });

  if (!group) {
    return false;
  }

  // if dnd check is disabled, return true
  if (!group.enable_checkDnd && !group.enable_checkProfanity) {
    return true;
  }

  // check if user has DND enabled for SMS, if yes return false
  if (args.contactInfo.dnd) {
    return false;
  }

  // if any on the dndSettings is active, return false
  for (let key in args.contactInfo.dndSettings) {
    // @ts-ignore
    if (args.contactInfo.dndSettings[key]?.status !== "inactive") {
      return false;
    }
  }

  if (group.enable_checkDnd) {
    // check if message is 'STOP' or 'STOPALL', if yes return false (and update DND status)
    if (
      args.message.toLowerCase() === "stop" ||
      args.message.toLowerCase() === "stopall"
    ) {
      await getGHLContactUpdate({
        context: args.context,
        contactId: args.contactInfo.id,
        groupID: args.groupID,
        updateData: {
          dnd: true,
        },
      });
      return false;
    }
  }

  if (group.enable_checkProfanity) {
    const openAIKey = group?.aiKey?.openapiKey || CONFIG.OPENAI_API_KEY;
    const profanityCheck = (await getCleanGPTResponse({
      apiKey: openAIKey,
      allHistory: [
        {
          role: "system",
          content:
            "The user will send a message, return 'true' if the message is profane, else return 'false'. Return the result as it is..",
        },
        {
          role: "user",
          content: args.message,
        },
      ],
    })) as ChatCompletion;

    if (profanityCheck.choices[0].message.content?.includes("true")) {
      await getGHLContactUpdate({
        context: args.context,
        contactId: args.contactInfo.id,
        groupID: args.groupID,
        updateData: {
          dnd: true,
        },
      });
      console.log("Profanity detected", args.message);
      return false;
    }
  }

  // return true if user
  return true;
}

export async function bootstrapConversation(args: {
  context: GlobalContext;
  groupID: string;
  contactID: string;
  locationID: string;
  toCheck: string;
  listAccessKey: string;
  opts?: {
    message?: string;
    checkDND?: boolean;
    user: LeadContact;
  };
}) {
  // get user information
  const user = await getGHLDetailedContact({
    context: args.context,
    groupID: args.groupID,
    input: {
      id: args.contactID,
    },
  });

  if (args.opts?.checkDND) {
    if (
      !(await checkDNDMessage({
        contactInfo: user,
        context: args.context,
        groupID: args.groupID,
        message: args.opts.message ?? "",
      }))
    ) {
      // console.log(`DND enabled [${args.contactID}]`);
      return;
    }
  }

  if (
    !(await checkEnabled({
      contactID: args.contactID,
      context: args.context,
      groupID: args.groupID,
      toCheck: args.toCheck,
      listAccessKey: args.listAccessKey,
    }))
  ) {
    // console.log(`Not enabled [on create] [${args.contactID}]`);
    return;
  }

  const agentInfo = await getGHLMe({
    context: args.context,
    groupID: args.groupID,
  });
  const timezone = user.timezone || agentInfo.timezone || "America/New_York";

  // console.log("Agent Info", agentInfo);

  const body = {
    location_id: args.locationID,
    first_name: user.firstName,
    last_name: user.lastName,
    agent_first_name: agentInfo.firstName,
    agent_last_name: agentInfo.lastName,
    ...user,
  };

  return {
    compiledUserData: body,
    userData: user,
    agentData: agentInfo,
    timezone,
  };
}
