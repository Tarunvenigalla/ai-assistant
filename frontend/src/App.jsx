import { useEffect, useRef, useState } from "react"
import Sidebar from "./components/Sidebar"
import InputBar from "./components/InputBar"
import ChatWindow from "./components/ChatWindow"
import { sendChatMessage }
from "./services/api"


function App() {

  const [chats, setChats] = useState([
    {
      id: 1,
      title: "New Chat",
      messages: [
        {
          text: "Hello 👋 How can I help you today?",
          sender: "ai"
        }
      ]
    }
  ])

  const [activeChatId, setActiveChatId] = useState(1)

  const activeChat = chats.find(
    (chat) => chat.id === activeChatId
  )

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef(null)

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [activeChat, isTyping])

  // Send message
  const sendMessage = async () => {

    if (input.trim() === "") return

    const userMessage = {
      text: input,
      sender: "user"
    }

    const userInput = input

    const chatTitle =
      userInput.length > 20
        ? userInput.substring(0, 20) + "..."
        : userInput

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,

              // Set title only once
              title:
                chat.title === "New Chat" ||
                chat.title.startsWith("Chat")
                  ? chatTitle
                  : chat.title,

              messages: [
                ...chat.messages,
                userMessage
              ]
            }
          : chat
      )
    )


    setInput("")

    setIsTyping(true)

    try {

      const aiResponse = await sendChatMessage(
        userInput
      )

      const aiMessage = {
        text: aiResponse,
        sender: "ai"
      }

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  aiMessage
                ]
              }
            : chat
        )
      )

    } catch (error) {

      console.error(error)

      const errorMessage = {
        text: "Error connecting to AI backend ❌",
        sender: "ai"
      }

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  errorMessage
                ]
              }
            : chat
        )
      )

    }

    setIsTyping(false)
  }

  // Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const createNewChat = () => {

    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      messages: [
        {
          text: "Hello 👋 How can I help you today?",
          sender: "ai"
        }
      ]
    }

    setChats([...chats, newChat])

    setActiveChatId(newChat.id)
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white">

      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-gray-700 text-xl font-semibold">
          Chat
        </div>

        <ChatWindow
          messages={activeChat?.messages || []}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />

        <InputBar
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          handleKeyDown={handleKeyDown}
        />

      </div>

    </div>
  )
}

export default App