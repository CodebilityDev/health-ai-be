// Contact Update Event

type DNDSetting = {
  code?: string;
  message?: string;
  status: string;
};

type DNDSettings = {
  Call: DNDSetting;
  Email: DNDSetting;
  SMS: DNDSetting;
};

export type ContactUpdate = {
  type: "ContactUpdate";
  locationId: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dnd: boolean;
  dndSettings: DNDSettings;
  tags: string[];
  country: string;
  dateAdded: string;
};

// Inbound Message

export type InboundMessage = {
  type: "InboundMessage";
  locationId: string;
  attachments: any[]; // Assuming the attachments are of type any[], replace with appropriate type if known
  body: string;
  contactId: string;
  contentType: string;
  conversationId: string;
  dateAdded: string;
  direction: string;
  messageType: string;
  messageId: string;
  status: string;
};

// Contact Create

export type ContactCreate = {
  type: "ContactCreate";
  locationId: string;
  id: string;
  address1: string;
  city: string;
  state: string;
  companyName: string;
  country: string;
  source: string;
  dateAdded: string;
  dateOfBirth: string;
  dnd: boolean;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  tags: string[];
  website: string;
  attachments: any[]; // Assuming the attachments are of type any[], replace with appropriate type if known
  assignedTo: string;
};

// Webhook Body

export type GHLWebhookBody =
  | {
      type: string;
      locationId: string;
      companyId: string;
    }
  | ContactUpdate
  | InboundMessage
  | ContactCreate;
