import axios from "axios"

const API_URL = "http://127.0.0.1:8000"

export const sendChatMessage = async (
  message,
  sessionId = "chat1"
) => {

  const response = await axios.post(

    `${API_URL}/chat`,

    {
      session_id: sessionId,
      message: message
    }

  )

  return response.data.response
}