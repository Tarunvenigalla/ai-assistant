function Sidebar({

  chats,
  activeChatId,
  setActiveChatId,
  createNewChat

}) {

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

      {/* Chat History */}
      <div className="flex flex-col gap-2 overflow-y-auto">

        {chats.map((chat) => (

          <button
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={
              activeChatId === chat.id
                ? "bg-gray-700 p-3 rounded-lg text-left"
                : "bg-gray-900 p-3 rounded-lg text-left hover:bg-gray-700"
            }
          >
            {chat.title}
          </button>

        ))}

      </div>

    </div>

  )
}

export default Sidebar