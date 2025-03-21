export const log = (message?: any, ...optionalParams: any[]) => {
  if (process.env.SHOW_LOGS !== 'true') return;
  console.log(message, ...optionalParams);
};
