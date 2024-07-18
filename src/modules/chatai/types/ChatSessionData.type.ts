import { ChatCompletionMessageParam } from "openai/resources";

export class ChatSessionData {
  history: ChatCompletionMessageParam[];

  constructor(history: ChatCompletionMessageParam[]) {
    this.history = history || [];
  }

  addMessage(message: ChatCompletionMessageParam) {
    this.history.push(message);
  }

  toString() {
    return JSON.stringify(this);
  }

  static fromString(data: string) {
    return new ChatSessionData(JSON.parse(data).history);
  }
}
