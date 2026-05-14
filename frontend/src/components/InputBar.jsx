function InputBar({

  input,
  setInput,
  sendMessage,
  handleKeyDown,
  isTyping,
  stopGenerating,
  regenerateResponse,
  editingIndex

}) {

  return (

    <div className="p-4 border-t border-gray-700 flex gap-3">

      {editingIndex !== null && (
        <div className="text-sm text-yellow-400">
          Editing message...
        </div>
      )}
      
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

      <button
        onClick={regenerateResponse}
        className="
          bg-gray-700
          hover:bg-gray-600
          px-4
          py-2
          rounded-xl
        "
      >
        ↻ Regenerate
      </button>

    </div>

  )
}

export default InputBar