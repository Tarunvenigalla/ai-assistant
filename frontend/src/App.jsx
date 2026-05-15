import { useEffect, useRef, useState } from "react"
import Sidebar from "./components/Sidebar"
import InputBar from "./components/InputBar"
import ChatWindow from "./components/ChatWindow"
import {
  sendChatMessage,
  generateChatTitle
} from "./services/api"


function App() {

  const [chats, setChats] = useState(() => {

    const savedChats =
      localStorage.getItem("ai_chats")

    return savedChats

      ? JSON.parse(savedChats)

      : [
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
        ]

  })

  const [activeChatId, setActiveChatId] = useState(1)

  const activeChat = chats.find(
    (chat) => chat.id === activeChatId
  )

  const [searchTerm, setSearchTerm] = useState("")
  const filteredChats = chats.filter((chat) =>
    chat.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef(null)
  const controllerRef = useRef(null)

  const [lastPrompt, setLastPrompt] = useState("")
  const [editingIndex, setEditingIndex] = useState(null)

  // Auto scroll
  useEffect(() => {

    localStorage.setItem(
      "ai_chats",
      JSON.stringify(chats)
    )

  }, [chats])

  // Send message
  const sendMessage = async () => {

    if (isTyping) return

    if (input.trim() === "") return

    const userInput = input

    const userMessage = {
      text: userInput,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }


    let aiResponseIndex = null

    setLastPrompt(userInput)

    setIsTyping(true)

    setInput("")

    // Add user message instantly
    setChats((prevChats) =>
      prevChats.map((chat) => {

        if (chat.id !== activeChatId)
          return chat

        let updatedMessages = [...chat.messages]

        // EDIT EXISTING MESSAGE
        if (editingIndex !== null) {

          aiResponseIndex = editingIndex + 1

          // update old user message
          updatedMessages[editingIndex] = {
            text: userInput,
            sender: "user"
          }

          // remove old AI response
          updatedMessages.splice(
            editingIndex + 1,
            1
          )

          // add fresh AI placeholder
          updatedMessages.splice(
            editingIndex + 1,
            0,
            {
              text: "",
              sender: "ai",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            }
          )

        } else {

          aiResponseIndex = updatedMessages.length + 1

          // Normal new message
          updatedMessages.push(
            userMessage,
            {
              text: "",
              sender: "ai",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            }
          )

        }

        return {
          ...chat,
          messages: updatedMessages
        }

      })
    )

    // Generate title in background
    generateChatTitle(userInput)
      .then((chatTitle) => {

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,

                  title:
                    chat.title === "New Chat" ||
                    chat.title.startsWith("Chat")
                      ? chatTitle
                      : chat.title
                }
              : chat
          )
        )

      })


    try {
      
      controllerRef.current =
        new AbortController()
      await sendChatMessage(

        userInput,

        (streamText) => {

          setChats((prevChats) =>
            prevChats.map((chat) => {

              if (chat.id !== activeChatId)
                return chat

              const updatedMessages = [
                ...chat.messages
              ]

              // Update last AI message live
              updatedMessages[
                aiResponseIndex
              ] = {
                text: streamText,
                sender: "ai",
                timestamp: updatedMessages[
                  aiResponseIndex
                ]?.timestamp || new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              }

              return {
                ...chat,
                messages: updatedMessages
              }

            })
          )

        },

        activeChatId.toString(),
        controllerRef.current

      )

    } catch (error) {

      // Ignore abort errors
      if (error.name === "AbortError") {

        console.log("Generation stopped")

      } else {

        console.error(error)

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      text: "Error connecting to AI backend ❌",
                      sender: "ai",
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    }
                  ]
                }
              : chat
          )
        )

      }

    }

    setIsTyping(false)
    setEditingIndex(null)
    setInput("")
  }

  const regenerateResponse = async () => {

    if (!lastPrompt || isTyping) return

    // Remove last AI message
    setChats((prevChats) =>
      prevChats.map((chat) => {

        if (chat.id !== activeChatId)
          return chat

        const updatedMessages = [...chat.messages]

        // Remove last AI response
        if (
          updatedMessages.length > 0 &&
          updatedMessages[updatedMessages.length - 1].sender === "ai"
        ) {
          updatedMessages.pop()
        }

        return {
          ...chat,
          messages: [
            ...updatedMessages,
            {
              text: "",
              sender: "ai",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            }
          ]
        }
      })
    )

    setIsTyping(true)

    try {

      controllerRef.current =
        new AbortController()

      await sendChatMessage(

        lastPrompt,

        (streamText) => {

          setChats((prevChats) =>
            prevChats.map((chat) => {

              if (chat.id !== activeChatId)
                return chat

              const updatedMessages = [
                ...chat.messages
              ]

              updatedMessages[
                updatedMessages.length - 1
              ] = {
                text: streamText,
                sender: "ai",
                timestamp: updatedMessages[
                  updatedMessages.length - 1
                ]?.timestamp || new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              }

              return {
                ...chat,
                messages: updatedMessages
              }

            })
          )

        },

        activeChatId.toString(),
        controllerRef.current

      )

    } catch (error) {

      console.error(error)

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
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }
      ]
    }

    setChats([...chats, newChat])

    setActiveChatId(newChat.id)
  }

  // Delete chat
  const deleteChat = (chatId) => {

    const updatedChats = chats.filter(
      (chat) => chat.id !== chatId
    )

    // Prevent deleting all chats
    if (updatedChats.length === 0) {

      const defaultChat = {
        id: 1,
        title: "New Chat",
        messages: [
          {
            text: "Hello 👋 How can I help you today?",
            sender: "ai"
          }
        ]
      }

      setChats([defaultChat])
      setActiveChatId(1)

      return
    }

    setChats(updatedChats)

    // Switch active chat if deleted
    if (activeChatId === chatId) {
      setActiveChatId(updatedChats[0].id)
    }

  }

  const renameChat = (
    chatId,
    newTitle
  ) => {

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title: newTitle
            }
          : chat
      )
    )

  }

  const editMessage = (text, index) => {

    setInput(text)

    setEditingIndex(index)

  }

  const stopGenerating = () => {

    if (controllerRef.current) {

      controllerRef.current.abort()

    }

    setIsTyping(false)
  }

  const deleteMessage = (index) => {

    setChats((prevChats) =>
      prevChats.map((chat) => {

        if (chat.id !== activeChatId)
          return chat

        const updatedMessages = [...chat.messages]

        // remove user message
        updatedMessages.splice(index, 1)

        // remove AI response if exists
        if (
          updatedMessages[index] &&
          updatedMessages[index].sender === "ai"
        ) {
          updatedMessages.splice(index, 1)
        }

        return {
          ...chat,
          messages: updatedMessages
        }

      })
    )

  }

  return (
    <div className="h-screen flex bg-gray-900 text-white">

      <Sidebar
        chats={filteredChats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        renameChat={renameChat}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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
          onEdit={editMessage}
          onDelete={deleteMessage}
          onRegenerate={regenerateResponse}
        />

        <InputBar
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          handleKeyDown={handleKeyDown}
          isTyping={isTyping}
          stopGenerating={stopGenerating}
          regenerateResponse={regenerateResponse}
          editingIndex={editingIndex}
        />

      </div>

    </div>
  )
}

export default App