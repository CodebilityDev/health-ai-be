// import { CONFIG } from "~/common/env";
// import { available_functions } from "./functions";
// import { getGitomerText } from "./getGitomerWelcome";
// import { getGPTResponse } from "./getGPTResponse";

// export const getWelcomeMsg = async (data: {
//   mission: string;
//   tone: string;
//   exMessage: string;
//   summary: string;
//   zipCode: any;
//   get: (arg0: string) => any;
//   plan: any;
//   recommendedPlan: any;
//   carriers: any;
//   dependents: any;
//   income: any;
// }) => {
//   let apiKey = CONFIG.OPENAI_API_KEY;
//   let messages = getGitomerText(data);
//   let response = await getGPTResponse({
//     apiKey,
//     messages: messages,
//   });

//   let iteration = 0;
//   while (response.choices[0].message.function_call) {
//     iteration += 1;
//     let functionName = response.choices[0].message.function_call.name;

//     let args = response.choices[0].message.function_call.arguments;

//     // @ts-ignore
//     let functionResponse = available_functions[functionName](args);

//     messages.push({
//       role: "assistant",
//       content: functionResponse.toString(),
//     });

//     response = await getGPTResponse({
//       apiKey,
//       messages: messages,
//     });

//     if (
//       functionName == "get_healthcare_plans" ||
//       functionName == "search_plans"
//     ) {
//       messages.pop();
//     }
//   }

//   let responseContent = response.choices[0].message.content;

//   return {
//     status: 200,
//     data: responseContent,
//     message: "Response generated",
//   };
// };
