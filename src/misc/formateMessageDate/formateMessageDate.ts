import  dayjs from "dayjs";
export const formatMessageDate = (dateString: any) => {
  if (!dateString) {
    return "";
  }
  try {
    const date = dayjs(dateString);
    if (!date.isValid()) {
      console.error("Parsed date is invalid.");
      return "Invalid Date";
    }

    const now = dayjs();
    const yesterday = now.subtract(1, "day");

    if (date.isSame(now, "day")) {
      return date.format("h:mm A"); // Format like '1:45 PM'
    } else if (date.isSame(yesterday, "day")) {
      return "Yesterday";
    } else {
      return date.format("MM/DD/YY"); // Format like 'MM/DD/YY'
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return "";
  }
};
