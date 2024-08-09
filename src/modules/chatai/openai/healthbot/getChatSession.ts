import { GlobalContext } from "~/common/context";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";

export const getChatSession = async (args: {
  sessionID: string;
  context: GlobalContext;
  type?: "welcome" | "chat";
  opts?: {
    createIfNotExists: boolean;
    keywordIfNotExists: string;
  };
}) => {
  const chatType = args.type ?? "chat";
  const sessionStorageTable = {
    chat: "chatConversationSession",
    welcome: "conversationBotConfig",
  };
  const rawchatSession =
    // @ts-ignore
    await args.context.prisma[sessionStorageTable[chatType]].findFirst({
      where: {
        id: args.sessionID,
      },
    });
  const chatSession = ChatSessionData.fromString(
    rawchatSession?.sessionData?.toString() ?? "{}",
  );

  if (!rawchatSession) {
    if (args.opts?.createIfNotExists) {
      // @ts-ignore
      await args.context.prisma[sessionStorageTable[chatType]].create({
        data: {
          id: args.sessionID,
          keywords: args.opts.keywordIfNotExists ?? "",
          sessionData: chatSession.toString(),
        },
      });
    }
  }

  return chatSession;
};
