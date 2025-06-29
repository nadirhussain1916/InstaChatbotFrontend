export const truncateMessage = message => {
  if (!message) return '';
  return message.length > 13 ? message.slice(0, 30) + '...' : message;
};

export const truncateUserName = message => {
  if (!message) return '';
  return message.length > 13 ? message.slice(0, 12) + '...' : message;
};
