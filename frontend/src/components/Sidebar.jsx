import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

function Sidebar({

  chats,
  activeChatId,
  setActiveChatId,
  createNewChat,
  deleteChat,
  renameChat,
  searchTerm,
  setSearchTerm

}) {

  const [editingChatId, setEditingChatId] =
    useState(null)

  const [editText, setEditText] =
    useState("")

  const startEditing = (chat) => {
    setEditingChatId(chat.id)
    setEditText(chat.title)
  }

  const saveEdit = () => {

    if (editText.trim() !== "") {
      renameChat(
        editingChatId,
        editText
      )
    }

    setEditingChatId(null)
  }

  return (

    <div className="w-64 bg-gray-800 p-4 flex flex-col">

      <h1 className="text-2xl font-bold mb-6">
        AI Assistant
      </h1>

      {/* New Chat */}
      <button
        onClick={createNewChat}
        className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition mb-4"
      >
        + New Chat
      </button>

       {/* Search */}
      <input

        type="text"

        placeholder="Search chats..."

        value={searchTerm}

        onChange={(e) =>
            setSearchTerm(e.target.value)
        }

        className="bg-gray-900 p-3 rounded-lg mb-4 outline-none text-white"

        />

      {/* Chat History */}
      <div className="flex flex-col gap-2 overflow-y-auto">

        {chats.map((chat) => (

          <div
            key={chat.id}
            className={`group flex items-center justify-between p-3 rounded-lg ${
              activeChatId === chat.id
                ? "bg-gray-700"
                : "bg-gray-900 hover:bg-gray-700"
            }`}
          >

            {/* Edit Mode */}
            {editingChatId === chat.id ? (

              <input
                value={editText}
                autoFocus
                onChange={(e) =>
                  setEditText(e.target.value)
                }

                onBlur={saveEdit}

                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    saveEdit()
                  }

                  if (e.key === "Escape") {
                    setEditingChatId(null)
                  }

                }}

                className="flex-1 bg-gray-600 text-white px-2 py-1 rounded outline-none"
              />

            ) : (

              <>
                {/* Chat Title */}
                <div
                  onClick={() =>
                    setActiveChatId(chat.id)
                  }
                  className="flex-1 truncate cursor-pointer"
                >
                  {chat.title}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-2 opacity-0 group-hover:opacity-100 transition">

                    {/* Rename */}
                    <button
                        onClick={() =>
                            startEditing(chat)
                        }
                        className="text-gray-300 hover:text-white"
                        >
                        <Pencil size={16} />
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() =>
                            deleteChat(chat.id)
                        }
                        className="text-red-400 hover:text-red-500"
                        >
                        <Trash2 size={16} />
                    </button>

                </div>
              </>

            )}

          </div>

        ))}

      </div>

    </div>

  )
}

export default Sidebar