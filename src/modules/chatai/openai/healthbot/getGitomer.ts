import { ChatCompletionMessageParam } from "openai/resources";

const defaultMission =
  "You are a helpful healthcare insurance agent. You should find and respond the insurance plans which matches all criteria that users give. And you must provide reason why you choose that and respond to user.";
const defaultTone = "Your tone should be funny.";
const defaultFormat = `Please respond to user with following format:
If the user doesn't provide zip code, please respond with this format: 'Hey [first name of the user], this is [first and last name of the agent]. Thank you for applying for $0 or low-cost health plans. Could you please provide your zip code?'
If you don't find any matched insurance plans, please respond with this format: 'Hey [first name of the user], this is [first and last name of the agent]. I haven't found any insurance plans that match your criteria.\n\n Could you please provide your requirements in more detail?'
If the user provides zip code, please respond with this format: 'Hey [first name of the user], this is [first and last name of the agent]. Thank you for applying for $0 or low-cost health plans.\n\n I found a $0 plan [the insurance plan name. only the name of insurance plan.] from [the carrier name. only the carrier name], in your zip code [zipcode of user].\n\n Please reach out if you have any other preferences, otherwise, we'll move forward with ensuring you are covered!'
If an API call fails, an error data will be returned indicating what went wrong with the request. As an intelligent agent, you should be able to handle this error by trying to analyze the error message returned by the server and attempting to use other functions that could resolve the issue. If the missing information is not provided, continue the conversation with the focus on completing the required information.'
`;
const example1 = `
Hey Ryan, this is Dave Jordan. Thank you for applying for $0 or low-cost health plans.

I found several $0 plans that match your criteria in your zip code 75757:

1. CHRISTUS Bronze from CHRISTUS Health Plan.
2. Blue Advantage Bronze HMO℠ 301 from Blue Cross and Blue Shield of Texas.
3. Blue Advantage Bronze HMO℠ 707 from Blue Cross and Blue Shield of Texas.

Please reach out if you have any other preferences, otherwise, we'll move forward with ensuring you are covered!
`;
const example2 = `
Hey, this is Dave Jordan. Thank you for applying for $0 or low-cost health plans. Could you please provide your zip code?
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
  let query =
    "Please give me insurance plans which matches all the following criteria.";

  let msg: ChatCompletionMessageParam[] = [];
  msg.push({
    role: "system",
    content: data.botSettings.mission || defaultMission,
  });
  msg.push({
    role: "system",
    content: "Your tone should be: " + data.botSettings.tone || defaultTone,
  });
  msg.push({
    role: "system",
    content: `${data.botSettings.exMessage || defaultFormat}`,
  });
  msg.push({
    role: "system",
    content: data.botSettings.summary || defaultSummary,
  });
  msg.push({
    role: "assistant",
    content:
      "This is example format1:" + data.botSettings.welcomeMessage || example1,
  });
  msg.push({
    role: "assistant",
    content:
      "This is example format2:" + data.botSettings.noZipCodeMessage ||
      example2,
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
  if (recommendedPlan.includes("best")) {
    msg.push({
      role: "user",
      content: "Criteria 2: Only respond the Best one plan.",
    });
  } else {
    msg.push({
      role: "user",
      content:
        "Criteria 2: Please respond several plans. Max 3 plans, Min 1 plan.",
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
