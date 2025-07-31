"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleverPushLog = void 0;
exports.CleverPushLog = {
    log: (message, ...args) => {
        console.log(`CleverPush: ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`CleverPush Error: ${message}`, ...args);
    }
};
