"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneHourFromNow = exports.fiveMinutesAgo = exports.oneDays = exports.oneYearFromNow = exports.fifteenMinutesFromNow = exports.ThirtyDaysFromNow = void 0;
const ThirtyDaysFromNow = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
exports.ThirtyDaysFromNow = ThirtyDaysFromNow;
const fifteenMinutesFromNow = () => new Date(Date.now() + 15 * 60 * 1000);
exports.fifteenMinutesFromNow = fifteenMinutesFromNow;
const oneYearFromNow = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
exports.oneYearFromNow = oneYearFromNow;
exports.oneDays = 24 * 60 * 60 * 1000;
const fiveMinutesAgo = () => new Date(Date.now() + 5 * 60 * 1000);
exports.fiveMinutesAgo = fiveMinutesAgo;
const oneHourFromNow = () => new Date(Date.now() + 60 * 60 * 1000);
exports.oneHourFromNow = oneHourFromNow;
//# sourceMappingURL=helpers.js.map