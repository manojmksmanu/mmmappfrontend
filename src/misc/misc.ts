interface User {
  _id: string;
  username?: string;
  name?: string;
  userType?: string;
}
interface OnlineUser {
  socketId: string;
  userId: string;
}
export const getSender = (loggedUser: any, users: any[]) => {
  if (users && loggedUser) {
    const sender = users.find((chatUser) => {
      return (
        chatUser.user &&
        chatUser.user._id?.toString() !== loggedUser?._id.toString()
      );
    });
    return sender ? sender : "Unknown Sender";
  }
  return "Unknown Sender";
};

export const getSenderName = (loggedUser: User, chatUsers: any[]) => {
  if (chatUsers && loggedUser) {
    const sender = chatUsers.find((chatUser) => {
      return (
        chatUser.user &&
        chatUser.user._id?.toString() !== loggedUser?._id.toString()
      );
    });
    return sender ? sender.user?.name || "Unknown Sender" : "Unknown Sender";
  }
  return "Unknown Sender";
};

export const getSendedType = (loggedUser: User, chatUsers: any[]) => {
  if (chatUsers && loggedUser) {
    const sender = chatUsers.find((chatUser) => {
      return (
        chatUser.user &&
        chatUser.user._id?.toString() !== loggedUser?._id.toString()
      );
    });
    return sender ? sender.user?.userType || "Unknown Type" : "Unknown Type";
  }
  return "Unknown Type";
};

export const getSenderStatus = (
  loggedUser: User,
  chatUsers: any[],
  onlineUsers: OnlineUser[]
) => {
  if (chatUsers && loggedUser) {
    const sender = chatUsers.find((chatUser) => {
      return (
        chatUser.user &&
        chatUser.user._id?.toString() !== loggedUser?._id.toString()
      );
    });

    if (sender) {
      return onlineUsers?.some((user) => user.userId === sender.user?._id)
        ? "online"
        : "offline";
    }
  }
  return "offline";
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getUserFirstLetter = (userName: any) => {
  return userName ? userName.charAt(0).toUpperCase() : "";
};
