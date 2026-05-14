import { useState } from "react"

import ReactMarkdown from "react-markdown"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

function CodeBlock({ language, value }) {

  const [copied, setCopied] = useState(false)

  const copyCode = async () => {

    await navigator.clipboard.writeText(value)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (

    <div className="relative">

      {/* Language Label */}
      <div
        className="
          absolute
          left-3
          top-3
          text-xs
          text-gray-300
          uppercase
          z-10
        "
      >
        {language}
      </div>

      {/* Copy Button */}
      <button
        onClick={copyCode}
        className="
          absolute
          right-3
          top-3
          bg-gray-700
          hover:bg-gray-600
          text-xs
          px-2
          py-1
          rounded
          text-white
          z-10
          transition-all
          duration-200
        "
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          borderRadius: "10px",
          paddingTop: "40px"
        }}
      >
        {value}
      </SyntaxHighlighter>

    </div>
  )
}

function MessageBubble({

  text,
  sender,
  onEdit,
  index

}) {

  return (

    <div
      className={`
        flex
        ${sender === "user"
          ? "justify-end"
          : "justify-start"}
      `}
    >

      <div
        className={`
          max-w-3xl
          px-4
          py-3
          rounded-2xl
          whitespace-pre-wrap
          break-words
          ${sender === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-white"}
        `}
      >

        <ReactMarkdown
          components={{

            code({ node, className, children }) {

              const match = /language-(\w+)/.exec(className || "")

              if (match) {

                return (
                  <CodeBlock
                    language={match[1]}
                    value={String(children).replace(/\n$/, "")}
                  />
                )
              }

              return (
                <code className="bg-gray-800 px-1 rounded">
                  {children}
                </code>
              )
            }

          }}
        >
          {text}
        </ReactMarkdown>
        
        {sender === "user" && (
          <button
            onClick={() => onEdit(text, index)}
            className="
              text-gray-300
              hover:text-white
              mt-2
              text-sm
            "
          >
            🖉
          </button>
        )}

      </div>

    </div>
  )
}

export default MessageBubble