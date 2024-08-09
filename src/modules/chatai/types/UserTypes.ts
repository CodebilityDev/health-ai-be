import { ChatCompletionMessageParam } from "openai/resources";

export type CT = ChatCompletionMessageParam;

export let SYS = (content: string): ChatCompletionMessageParam => {
  return { role: "system", content };
};

export let USER = (content: string): ChatCompletionMessageParam => {
  return { role: "user", content };
};

export let AGENT = (content: string): ChatCompletionMessageParam => {
  return { role: "assistant", content };
};
