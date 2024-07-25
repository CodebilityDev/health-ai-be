import { ChatCompletionMessageParam } from "openai/resources";

export class ChatSessionData {
  history: ChatCompletionMessageParam[];
  lastMessageID?: string;

  constructor(history: ChatCompletionMessageParam[], lastMessageID?: string) {
    this.history = history || [];
    this.lastMessageID = lastMessageID;
  }

  addMessage(message: ChatCompletionMessageParam) {
    this.history.push(message);
  }

  toString() {
    return JSON.stringify(this);
  }

  static fromString(data: string) {
    let parsedData = JSON.parse(data);
    return new ChatSessionData(parsedData.history, parsedData.lastMessageID);
  }
}
