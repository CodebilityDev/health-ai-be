import { GlobalContext } from "~/common/context";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";

export const saveChatSession = async (args: {
  sessionID: string;
  modelID: string;
  chatSession: ChatSessionData;
  context: GlobalContext;
}) => {
  // console.log(resp.messages);
  if (args.sessionID) {
    await args.context.prisma.chatConversationSession.update({
      where: {
        id: args.sessionID,
      },
      data: {
        sessionData: args.chatSession.toString(),
        botConfigId: args.modelID,
      },
    });
  } else {
    await args.context.prisma.chatConversationSession.create({
      data: {
        id: args.sessionID,
        sessionData: args.chatSession.toString(),
        botConfigId: args.modelID,
      },
    });
  }
};
