import { GlobalContext } from "~/common/context";
import {
  ContactCreate,
  ContactUpdate,
  GHLWebhookBody,
  InboundMessage,
} from "../types/GHLWebhookBody.type";
import { onCreate } from "./onCreate";
import { onNewMessage } from "./onNewMessage";
import { onUpdate } from "./onUpdate";

export const webhookRoutine = async (args: {
  payload: GHLWebhookBody;
  context: GlobalContext;
}) => {
  // get the latest user that is associated with the location
  const locationID = args.payload.locationId;
  const group = await args.context.prisma.gHLAccess.findFirst({
    where: {
      locationId: locationID,
      group: {
        id: {
          equals: locationID,
        },
      },
    },
    include: {
      group: true,
    },
  });

  if (!group?.group) {
    return;
  }

  // console.log("Webhook Routine", args.payload);

  switch (args.payload.type) {
    case "ContactUpdate": {
      // handle contact update
      const _payload = args.payload as ContactUpdate;
      await onUpdate({
        locationID: _payload.locationId,
        groupID: group?.group.id,
        contactID: _payload.id,
        context: args.context,
      });
      break;
    }
    case "ContactCreate": {
      // handle contact create
      const _payload = args.payload as ContactCreate;
      await onCreate({
        locationID: _payload.locationId,
        groupID: group?.group.id,
        contactID: _payload.id,
        context: args.context,
      });
      break;
    }
    case "InboundMessage": {
      // handle inbound message
      const _payload = args.payload as InboundMessage;
      await onNewMessage({
        locationID: _payload.locationId,
        groupID: group?.group.id,
        contactID: _payload.contactId,
        context: args.context,
        message: _payload.body,
        conversationID: _payload.conversationId,
        messageID: _payload.messageId,
        messageType: _payload.messageType,
      });
      // console.log("end of msg");
      break;
    }
  }
};
