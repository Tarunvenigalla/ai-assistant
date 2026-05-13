function InputBar({

  input,
  setInput,
  sendMessage,
  handleKeyDown,
  isTyping,
  stopGenerating

}) {

  return (

    <div className="p-4 border-t border-gray-700 flex gap-3">

      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-gray-800 p-4 rounded-xl outline-none text-lg"
      />

      <button

        onClick={
          isTyping
            ? stopGenerating
            : sendMessage
        }

        className={`px-8 rounded-xl text-white transition ${
          isTyping
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >

        {isTyping ? "Stop" : "Send"}

      </button>

    </div>

  )
}

export default InputBar