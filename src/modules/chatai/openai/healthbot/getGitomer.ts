import { ChatCompletionMessageParam } from "openai/resources";

const defaultMission =
  "You are a helpful healthcare insurance agent. You should find and respond the insurance plans which matches all criteria that users give. And you must provide reason why you choose that and respond to user.";
const defaultTone = "Your tone should be funny.";

const example1 = `
Hey [first name of user], this is [first and last name of agent]. Thank you for applying for $0 or low-cost health plans.

I found several $0 plans that match your criteria in your zip code [zip code]:

[plan name] of [plan provider]. [plan_id] Only [price] per month. 
- [unique selling point]
- [selling point]
- [selling point]
- [selling point]

Please reach out if you have any other preferences, otherwise, we'll move forward with ensuring you are covered!
`;
const example2 = `
Hey, this is [first and last name of agent]. Thank you for applying for $0 or low-cost health plans. Could you please provide your zip code?
`;
const defaultFormat = `Please respond to user with following format:
If you don't find any matched insurance plans, you can just ignore the parameters provided and get the next best recommendable plan. Just act like you still got the best plan.
If an API call fails, an error data will be returned indicating what went wrong with the request. As an intelligent agent, you should be able to handle this error by trying to analyze the error message returned by the server and attempting to use other functions that could resolve the issue. If the missing information is not provided, continue the conversation with the focus on completing the required information.'
As an intelligent agent, you should solicit the zip code from the user if it is not provided. If the user provides the zip code, you should use it to search for a plan using the provided parameters if applicable. If the search_plans api returned an error, I should check the provided zip code if it is correct and if it is, retry the search_plans api call. If the search_plans api call fails again, I should respond to the user about the issue and ask for clarification. If the user doesn't provide the zip code, I should respond with a message asking the user to provide the zip code.';
`;
const defaultSummary =
  "Rules for responding: Split each insurance by new line. Max 3 plans. Please replace all content inside backets with appropriate information. If there is no appropriate information for content inside brackets, please replace with ''. Don't send brackets to user.";

export const getGitomerText = (data: {
  botSettings: {
    mission: string;
    tone: string;
    exMessage: string;
    welcomeMessage: string;
    noZipCodeMessage: string;
    summary: string;
    plan: any;
    recommendedPlan: any;
    carriers: any;
  };
  agent: {
    firstName: string;
    lastName: string;
  };
}) => {
  // console.log(data);
  let query =
    "Please give me insurance plans which matches all the following criteria.";

  let msg: ChatCompletionMessageParam[] = [];
  msg.push({
    role: "system",
    content:
      "You will reply in concise answers and not exceed 1600 characters.",
  });
  msg.push({
    role: "system",
    content: "Don't use markdown formatting. Use plain text only.",
  });
  msg.push({
    role: "system",
    content: data.botSettings.mission || defaultMission,
  });
  msg.push({
    role: "system",
    content: "Your tone should be: " + (data.botSettings.tone || defaultTone),
  });
  msg.push({
    role: "system",
    content: data.botSettings.summary || defaultSummary,
  });
  msg.push({
    role: "system",
    content: `${data.botSettings.exMessage || defaultFormat}`,
  });
  msg.push({
    role: "system",
    content:
      "If the user provides zip code. Search for a plan using the provided parameters if applicable, then return the following response based on what you kow: " +
      (data.botSettings.welcomeMessage || example1),
  });
  msg.push({
    role: "system",
    content:
      "If the user doesn't provide zip or postal code, don't recommend any plan and instead reply with this message:" +
      (data.botSettings.noZipCodeMessage || example2),
  });
  msg.push({ role: "user", content: query });
  msg.push({
    role: "user",
    content: JSON.stringify({
      // first_name: data.client["firstName"],
      // last_name: data.client["lastName"],
      agent_first_name: data.agent["firstName"],
      agent_last_name: data.agent["lastName"],
    }),
  });
  const plan = data.botSettings.plan;
  if (plan != "") {
    msg.push({
      role: "user",
      content: `Criteria 1: Only respond with ${plan} plan`,
    });
  }

  const recommendedPlan = data.botSettings.recommendedPlan;
  if (recommendedPlan.includes("3")) {
    msg.push({
      role: "user",
      content:
        "Criteria 2: Please respond several plans. Max 3 plans, Min 1 plan.",
    });
  } else {
    msg.push({
      role: "user",
      content: "Criteria 2: Only respond the Best one plan.",
    });
  }

  const carriers = data.botSettings.carriers;
  if (carriers.length) {
    msg.push({
      role: "user",
      content: `Criteria 3: Only respond insurance from these carriers - ${carriers}.`,
    });
  }

  return msg;
};
