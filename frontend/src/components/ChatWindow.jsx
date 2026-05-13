import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"

function ChatWindow({

  messages,
  isTyping,
  messagesEndRef

}) {

  return (

    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {messages.map((msg, index) => (

        <MessageBubble
          key={index}
          text={msg.text}
          sender={msg.sender}
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