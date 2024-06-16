export function errorJSON(err: any) {
  let propertyNames = Object.getOwnPropertyNames(err);
  let error: any = {};
  for (let i = 0; i < propertyNames.length; i++) {
    error[propertyNames[i]] = err[propertyNames[i]];
  }
  // if production, don't show stack
  if (process.env.NODE_ENV === "production") {
    delete error.stack;
  }
  return error;
}
