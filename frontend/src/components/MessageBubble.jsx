import ReactMarkdown from "react-markdown"

import { Prism as SyntaxHighlighter }
from "react-syntax-highlighter"

import { oneDark }
from "react-syntax-highlighter/dist/esm/styles/prism"

function MessageBubble({ message }) {

  return (

    <div
      className={
        message.sender === "user"
          ? "flex justify-end"
          : "flex justify-start"
      }
    >

      <div
        className={
          message.sender === "user"
            ? "bg-blue-600 px-5 py-3 rounded-2xl max-w-3xl text-lg"
            : "bg-gray-700 px-5 py-3 rounded-2xl max-w-3xl text-lg"
        }
      >

        {/* USER MESSAGE */}
        {message.sender === "user" ? (

          message.text

        ) : (

          <ReactMarkdown
            components={{

              code({
                inline,
                className,
                children,
                ...props
              }) {

                const match = /language-(\w+)/.exec(
                  className || ""
                )

                return !inline && match ? (

                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>

                ) : (

                  <code className="bg-gray-800 px-1 rounded">
                    {children}
                  </code>

                )
              }
            }}
          >
            {message.text}
          </ReactMarkdown>

        )}

      </div>

    </div>

  )
}

export default MessageBubble