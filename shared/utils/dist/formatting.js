"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateText = exports.formatDate = void 0;
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US').format(date);
};
exports.formatDate = formatDate;
const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
exports.truncateText = truncateText;
