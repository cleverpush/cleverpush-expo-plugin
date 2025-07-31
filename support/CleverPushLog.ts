export const CleverPushLog = {
  log: (message: string, ...args: any[]) => {
    console.log(`CleverPush: ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`CleverPush Error: ${message}`, ...args);
  }
}; 