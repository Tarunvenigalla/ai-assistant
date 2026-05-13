import { useState } from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Prism as SyntaxHighlighter }
from "react-syntax-highlighter"

import { oneDark }
from "react-syntax-highlighter/dist/esm/styles/prism"

function MessageBubble({ text, sender }) {

  const [copied, setCopied] =
    useState(false)

  const copyCode = (code) => {

    navigator.clipboard.writeText(code)

    setCopied(true)

    setTimeout(() => {

      setCopied(false)

    }, 2000)

  }

  return (

    <div
      className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap ${
        sender === "user"
          ? "bg-blue-600 self-end ml-auto"
          : "bg-gray-700 self-start"
      }`}
    >

      <ReactMarkdown

        remarkPlugins={[remarkGfm]}

        components={{

          code({

            inline,
            className,
            children

          }) {

            const match =
              /language-(\w+)/.exec(
                className || ""
              )

            const codeText =
              String(children).replace(/\n$/, "")

            // Inline code
            if (inline) {

              return (
                <code className="bg-gray-800 px-1 rounded">
                  {children}
                </code>
              )

            }

            return (

              <div className="relative">

                {/* Copy Button */}
                <button

                  onClick={() =>
                    copyCode(codeText)
                  }

                  className="absolute top-2 right-2 bg-gray-800 text-sm px-2 py-1 rounded hover:bg-gray-900 transition z-10"
                >

                  {copied
                    ? "Copied!"
                    : "Copy"}

                </button>

                {/* Syntax Highlighted Code */}
                <SyntaxHighlighter

                  language={
                    match
                      ? match[1]
                      : "javascript"
                  }

                  style={oneDark}

                  customStyle={{
                    borderRadius: "12px",
                    padding: "20px",
                    margin: 0,
                  }}

                >

                  {codeText}

                </SyntaxHighlighter>

              </div>

            )

          }

        }}

      >

        {text}

      </ReactMarkdown>

    </div>

  )
}

export default MessageBubble