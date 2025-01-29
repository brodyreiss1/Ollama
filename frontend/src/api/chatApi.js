import { API_BASE_URL } from "../env";

export const sendMessageToApi = async (messages, model = "deepseek-r1:32b") => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ messages, model }),
    });

    return response.body.getReader();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
