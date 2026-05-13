const API_URL = "http://127.0.0.1:8000"

export const sendChatMessage = async (

  message,
  onStream,
  sessionId,
  controller

) => {

  const response = await fetch(

    `${API_URL}/chat`,

    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        session_id: sessionId,
        message: message
      }),

      signal: controller.signal
    }
  )

  const reader =
    response.body.getReader()

  const decoder =
    new TextDecoder()

  let fullText = ""

  while (true) {

    const { done, value } =
      await reader.read()

    if (done) break

    const chunk =
      decoder.decode(value)

    fullText += chunk

    onStream(fullText)

  }
}

export const generateChatTitle = async (
  message
) => {

  const response = await fetch(
    `${API_URL}/generate-title`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: "title",
        message: message,
      }),
    }
  )

  const data = await response.json()

  return data.title
}