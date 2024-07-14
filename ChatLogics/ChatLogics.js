export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
export const getSenderCompleteDetails = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (
  messages,
  currentMsg,
  indexOfCurrentMsg,
  loggedInUserId
) => {
  return (
    (indexOfCurrentMsg === messages.length - 1 ||
      messages[indexOfCurrentMsg + 1].sender._id !== currentMsg.sender._id) &&
    messages[indexOfCurrentMsg].sender._id !== loggedInUserId
  );
};

export const isLastMessage = (messages, indexOfCurrentMsg, loggedInUserId) => {
  const lastMessage = messages[messages.length - 1];
  return (
    indexOfCurrentMsg === messages.length - 1 &&
    lastMessage.sender._id !== loggedInUserId &&
    lastMessage.sender._id
  );
};

export const isSameSenderMargin = (
  messages,
  currentMsg,
  indexOfCurrentMsg,
  loggedInUserId,
  isGroupChat
) => {
  if (
    indexOfCurrentMsg < messages.length - 1 &&
    messages[indexOfCurrentMsg + 1].sender._id === currentMsg.sender._id &&
    messages[indexOfCurrentMsg].sender._id !== loggedInUserId
  )
    return isGroupChat ? 33 : 0;
  else if (
    (indexOfCurrentMsg < messages.length - 1 &&
      messages[indexOfCurrentMsg + 1].sender._id !== currentMsg.sender._id &&
      messages[indexOfCurrentMsg].sender._id !== loggedInUserId) ||
    (indexOfCurrentMsg === messages.length - 1 &&
      messages[indexOfCurrentMsg].sender._id !== loggedInUserId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, currentMsg, indexOfCurrentMsg) => {
  return (
    indexOfCurrentMsg > 0 &&
    messages[indexOfCurrentMsg - 1].sender._id === currentMsg.sender._id
  );
};
