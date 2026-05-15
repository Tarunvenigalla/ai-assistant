import { ArrowUp } from "lucide-react"

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

        className="
          w-12
          h-12
          rounded-full
          bg-black
          flex
          items-center
          justify-center
          hover:scale-105
          transition
        "
      >

        {isTyping ? (

          <div className="text-white font-bold">
            ■
          </div>

        ) : (

          <ArrowUp
            size={20}
            color="white"
          />

        )}

      </button>

    </div>

  )
}

export default InputBar