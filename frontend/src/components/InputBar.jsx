function InputBar({

  input,
  setInput,
  sendMessage,
  handleKeyDown

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
        onClick={sendMessage}
        className="bg-blue-600 px-8 rounded-xl hover:bg-blue-700 transition"
      >
        Send
      </button>

    </div>

  )
}

export default InputBar