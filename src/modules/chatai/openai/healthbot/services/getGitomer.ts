import { CT, SYS } from "../../../types/UserTypes";

const defaultMission =
  "You are a helpful healthcare insurance agent. You should find and respond the insurance plans which matches all criteria that users give. And you must provide reason why you choose that and respond to user.";
const defaultTone = "Your tone should be funny.";

const example1 = `
Hey [first name of user], this is [agent name]. Thank you for applying for $0 or low-cost health plans.

I found several $0 plans that match your criteria in your zip code [zip code]:

[plan name] of [plan provider]. [plan_id] Only [price] per month. 
- [unique selling point]
- [selling point]
- [selling point]
- [selling point]

Please reach out if you have any other preferences, otherwise, we'll move forward with ensuring you are covered!
`;
const example2 = `
Hey, this is [agent name]. Thank you for applying for $0 or low-cost health plans. Could you please provide your zip code?
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
  config: {
    isAnAssistant?: boolean;
    assitantName?: string;
    noSSN?: boolean;
    dndReminder?: boolean;
    dndNoticeMessage?: string;
    activeSurvey?: boolean;
    activeSurveyTargetFields?: string;
    activeSurveySample?: string;
  };
  agent: {
    firstName: string;
    lastName: string;
  };
}) => {
  // ========================= Format Rules =========================

  let formatRules: CT[] = [
    SYS("You will reply in concise answers and not exceed 1600 characters"),
    SYS("Don't use markdown formatting. Use plain text only."),
  ];

  // ========================= Behavior Rules =========================

  let behaviorRules: CT[] = [
    SYS(data.botSettings.mission || defaultMission),
    SYS("Your tone should be: " + (data.botSettings.tone || defaultTone)),
    SYS(data.botSettings.summary || defaultSummary),
  ];

  if (data.botSettings.plan != "") {
    behaviorRules.push(
      SYS(`Criteria 1: Only respond with ${data.botSettings.plan} plan`),
    );
  }

  const recommendedPlan = data.botSettings.recommendedPlan;
  if (recommendedPlan.includes("3")) {
    behaviorRules.push(
      SYS("Criteria 2: Please respond several plans. Max 3 plans, Min 1 plan."),
    );
  } else {
    behaviorRules.push(SYS("Criteria 2: Only respond the Best one plan."));
  }

  const carriers = data.botSettings.carriers;
  if (carriers.length) {
    behaviorRules.push(
      SYS(
        `Criteria 3: Only respond insurance from these carriers - ${carriers}.`,
      ),
    );
  }

  if (data.config.isAnAssistant) {
    let assistantCall =
      data.config.assitantName ||
      `[agent first name] [agent last name]'s Assistant`;
    behaviorRules.push(
      SYS(
        `You are an assistant. Whenever you'll use the agent's first name and last name or have to introduce youtself, you should ALWAYS USE the following format: ${assistantCall}`,
      ),
    );
  }

  if (data.config.noSSN) {
    behaviorRules.push(
      SYS(
        "Avoid asking for SSN (Social Security Number) and if the user provides SSN, don't store it or use it in any way.",
      ),
    );
  }

  if (data.config.dndReminder) {
    const dndMessage =
      data.config.dndNoticeMessage || "Reply STOP to unsubscribe";
    behaviorRules.push(
      SYS(
        `On end of each message, you should provide a way for user to unsubscribe from our messages. To do that, you can add '${dndMessage}' at the end of each message.`,
      ),
    );
  }

  behaviorRules.push(SYS(`${data.botSettings.exMessage || defaultFormat}`));
  behaviorRules.push(
    SYS(
      "If the user provides zip code. Search for a plan using the provided parameters if applicable, then return the following response based on what you kow: " +
        (data.botSettings.welcomeMessage || example1),
    ),
  );
  behaviorRules.push(
    SYS(
      "If the user doesn't provide zip or postal code, don't recommend any plan and instead reply with this message:" +
        (data.botSettings.noZipCodeMessage || example2),
    ),
  );

  behaviorRules.push(
    SYS(
      "On getPlanRecommendation and you haven't found any match. Do not use the tempalte to respond. Instead tell the user that you couldn't find any match and provide the next best recommendable plan.",
    ),
  );

  behaviorRules.push(
    SYS(
      "If you call a function and it returns a key 'botFlag' and value 'LocationDataUnavailable', it means that the location is queries correctly but there is no insurance plan available in the area. In that case, you should inform the user about it and ask if they would instead like to inquire about a different location. Eg, 'It seems like [county name] is not included in our database of insurance plans. Would you like to inquire about a different location? Or we could have a dedicated agent reach out to you to discuss your options.'. If the user provided a new address or zip code, ignore the first given zip code and try to refetch data again",
    ),
  );

  // ========================= Profile Builder =========================

  let profileContext: CT[] = [
    SYS(
      "Please give me insurance plans which matches all the following criteria.",
    ),
    SYS(
      JSON.stringify({
        // first_name: data.client["firstName"],
        // last_name: data.client["lastName"],
        agent_first_name: data.agent["firstName"],
        agent_last_name: data.agent["lastName"],
        name_format:
          data.config.isAnAssistant && data.config.assitantName
            ? data.config.assitantName
            : `[agent first name] [agent last name]'s Assistant`,
      }),
    ),
  ];

  // ========================= Compiled Message =========================

  let msg: CT[] = [...formatRules, ...behaviorRules, ...profileContext];

  // console.log(JSON.stringify(msg, null, 2));

  // ========================= POst Messags =========================

  let postMessages: CT[] = [];

  if (data.config.activeSurvey) {
    // console.log("activeSurvey");

    postMessages.push(
      SYS(
        (data.config.activeSurveySample ||
          "Once you had suggested a plan. Ask the user if they would want to build their profile so that you could help them for insurance application. If they agreed, on the next messages, ask the customer about the following information: ") +
          (data.config.activeSurveyTargetFields || "[]") +
          ".Only ask one question at a time. Attempt to interpret the fields into user-friendly names. Skip fields that you have already asked. Continue to ask for this information until you get a response and all of the user information is collected.",
      ),
    );
  }

  return {
    preMessage: msg,
    postMessage: postMessages,
  };
};
