import OpenAI from "openai";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import { available_functions } from "./functions";
import { functionsFormat } from "./functionsFormat";

export const getCleanGPTResponse = async (args: {
  apiKey: string;
  allHistory: ChatCompletionMessageParam[];
  options?: Partial<ChatCompletionCreateParamsBase>;
}) => {
  const openAIClient = new OpenAI({
    apiKey: args.apiKey,
  });
  return await openAIClient.chat.completions.create({
    ...(args.options ?? {}),
    model: "gpt-4o-2024-05-13",
    messages: args.allHistory,
  });
};

export const getGPTResponse = async (args: {
  apiKey: string;
  preMessages?: ChatCompletionMessageParam[];
  messages: ChatCompletionMessageParam[];
  output: (args: {
    type: "reply" | "functionCall" | "functionReturn" | "functionError";
    content: string;
  }) => void;
}) => {
  const openAIClient = new OpenAI({
    apiKey: args.apiKey,
  });

  let lastResponse: ChatCompletion | null = null;
  let lastFunctionArgs: any = {};
  let curMessages = args.messages;

  while (true) {
    let allHistory = [...(args.preMessages ?? []), ...curMessages];
    lastResponse = await openAIClient.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      messages: allHistory,
      functions: functionsFormat,
      function_call: "auto",
    });

    if (!lastResponse.choices[0].message.function_call) {
      break;
    }

    // console.log(lastResponse.choices[0].message.function_call.name);
    const functionName = lastResponse.choices[0].message.function_call.name;
    const functionArgs = JSON.parse(
      lastResponse.choices[0].message.function_call.arguments ?? "{}",
    );

    // @ts-ignore
    if (!available_functions[functionName]) {
      throw new Error(`Function ${functionName} not found`);
    }
    // console.log("Function name: ", functionName);
    // console.log("args:", functionArgs);
    try {
      args.output({
        type: "functionCall",
        content: JSON.stringify({ name: functionName }),
      });

      lastFunctionArgs = {
        name: functionName,
        args: functionArgs,
      };

      const functionResponse =
        // @ts-ignore
        await available_functions[functionName](functionArgs);

      // console.log({
      //   type: functionName,
      //   content: JSON.stringify(functionResponse),
      // });

      args.output({
        type: "functionReturn",
        content: JSON.stringify(functionResponse),
      });

      curMessages.push({
        role: "function",
        name: functionName,
        content: JSON.stringify(functionResponse),
      });
    } catch (e: any) {
      // throw new Error(`Function ${functionName} failed: ${e.message}`);
      // // get the data message from error
      // // curMessages.push({
      // //   role: "function",
      // //   name: functionName,
      // //   content: JSON.stringify({ error: e.message }),
      // // });
      console.log({ lastFunctionArgs, error: e.response.data });
      args.output({
        type: "functionError",
        content: JSON.stringify({ error: e.response.data }),
      });
      curMessages.push({
        role: "function",
        name: functionName,
        content: JSON.stringify({
          error: JSON.stringify(e.response.data),
          tryAgain: true,
        }),
      });
    }
  }

  curMessages.push({
    role: "assistant",
    content: lastResponse.choices[0].message.content ?? "",
  });

  args.output({
    type: "reply",
    content: lastResponse.choices[0].message.content ?? "",
  });

  return {
    lastResponse,
    curMessages,
  };
};
