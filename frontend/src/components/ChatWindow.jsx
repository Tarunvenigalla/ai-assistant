import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"
import { useEffect } from "react"

function ChatWindow({

  messages,
  isTyping,
  messagesEndRef,
  onEdit

}) {

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })

  }, [messages, isTyping])

  return (

    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {messages.map((msg, index) => (

        <MessageBubble
          key={index}
          text={msg.text}
          sender={msg.sender}
          index={index}
          onEdit={onEdit}
        />

      ))}

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator />}

      {/* Auto Scroll */}
      <div ref={messagesEndRef} />

    </div>

  )
}

export default ChatWindow