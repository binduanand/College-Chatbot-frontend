import { useState, useRef, useEffect } from "react";

const API_BASE = "http://localhost:5000/api";

const SUGGESTIONS = [
  "Admission",
  "Courses",
  "Scholarships",
  "Hostel",
  "Fees"
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Hi there! I'm the College Chatbot. I can answer questions about admissions, courses, fees, scholarships, and more. What would you like to know?",
      source: null,
    },
  ]);
   const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const autoResize = () => {
    const ta = textareaRef.current;

    if (!ta) return;

    ta.style.height = "auto";
    ta.style.height =
      Math.min(ta.scrollHeight, 120) + "px";
  };

  const sendMessage = async (text = "") => {
    const msg = (text || input).trim();

    if (!msg || loading) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: msg,
        source: null,
      },
    ]);

    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          message: msg,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text:
            data.reply ||
            "Sorry, I couldn't get a response.",
          source:
            data.source || null,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text:
            "Please visit the admissions office or contact support@example.com for help.",
          source: "Fallback",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f5f4f0;
          height: 100vh;
          overflow: hidden;
        }

        .cc-app {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .cc-header {
          background: #fff;
          border-bottom: 1px solid #e8e6e0;
          padding: 0 1.5rem;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          z-index: 10;
        }

        .cc-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cc-logo-icon {
          width: 34px;
          height: 34px;
          background: #1a3a5c;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cc-logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #1a1a1a;
          letter-spacing: -0.3px;
        }

        .cc-logo-text em {
          font-style: italic;
          color: #e85d2f;
        }

        .cc-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #888;
          background: #f5f4f0;
          padding: 5px 12px;
          border-radius: 20px;
          border: 1px solid #e2e0d8;
        }

        .cc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: cc-pulse 2s infinite;
        }

        @keyframes cc-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .cc-hero {
          background: #fff;
          border-bottom: 1px solid #e8e6e0;
          padding: 2rem 1.5rem 1.5rem;
          text-align: center;
          flex-shrink: 0;
        }

        .cc-hero h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          font-weight: 400;
          color: #1a1a1a;
          line-height: 1.25;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .cc-hero h1 em {
          font-style: italic;
          color: #e85d2f;
        }

        .cc-hero p {
          font-size: 14px;
          color: #777;
          max-width: 400px;
          margin: 0 auto 1.25rem;
          line-height: 1.6;
        }

        .cc-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          justify-content: center;
          max-width: 580px;
          margin: 0 auto;
        }

        .cc-chip {
          background: #f5f4f0;
          border: 1px solid #e2e0d8;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          color: #555;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .cc-chip:hover {
          background: #e8f0f8;
          border-color: #1a3a5c;
          color: #1a3a5c;
        }

        .cc-chip:disabled { opacity: 0.5; cursor: not-allowed; }

        .cc-chat {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .cc-messages {
          max-width: 680px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cc-row {
          display: flex;
          gap: 10px;
          animation: cc-fadeup 0.2s ease;
        }

        .cc-row.user { flex-direction: row-reverse; }

        @keyframes cc-fadeup {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cc-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .cc-avatar.bot  { background: #1a3a5c; color: #fff; }
        .cc-avatar.user { background: #e85d2f; color: #fff; }

        .cc-bubble {
          max-width: 72%;
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.65;
          border-radius: 16px;
        }

        .cc-bubble.bot {
          background: #fff;
          border: 1px solid #e8e6e0;
          border-bottom-left-radius: 4px;
          color: #1a1a1a;
        }

        .cc-bubble.user {
          background: #1a3a5c;
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .cc-source {
          display: inline-block;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 10px;
          margin-top: 6px;
          font-weight: 500;
        }

        .cc-source.faq      { background: #e8f0f8; color: #1a3a5c; }
        .cc-source.gemini   { background: #fde8e1; color: #9a3510; }
        .cc-source.fallback { background: #f5f4f0; color: #888; }

        .cc-typing {
          display: flex;
          gap: 5px;
          align-items: center;
          padding: 4px 2px;
        }

        .cc-typing span {
          width: 7px;
          height: 7px;
          background: #aaa;
          border-radius: 50%;
          display: inline-block;
          animation: cc-bounce 1.2s infinite;
        }

        .cc-typing span:nth-child(2) { animation-delay: 0.2s; }
        .cc-typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes cc-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }

        .cc-input-area {
          background: #fff;
          border-top: 1px solid #e8e6e0;
          padding: 1rem 1.5rem;
          flex-shrink: 0;
        }

        .cc-input-wrap {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: #f5f4f0;
          border: 1px solid #dcdad2;
          border-radius: 14px;
          padding: 10px 10px 10px 16px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .cc-input-wrap:focus-within {
          border-color: #1a3a5c;
          box-shadow: 0 0 0 3px rgba(26,58,92,0.08);
        }

        .cc-textarea {
          flex: 1;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          resize: none;
          outline: none;
          line-height: 1.5;
          max-height: 120px;
          min-height: 22px;
        }

        .cc-textarea::placeholder { color: #aaa; }

        .cc-send {
          width: 36px;
          height: 36px;
          background: #1a3a5c;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s, transform 0.1s;
        }

        .cc-send:hover   { background: #253f5e; }
        .cc-send:active  { transform: scale(0.95); }
        .cc-send:disabled { background: #ccc; cursor: not-allowed; }

        .cc-hint {
          text-align: center;
          font-size: 11px;
          color: #aaa;
          margin-top: 8px;
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>

       <div className="cc-app">
        {/* HEADER */}
        <header className="cc-header">
          <div className="cc-logo">
            <div className="cc-logo-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>

            <span className="cc-logo-text">
              College <em>Chatbot</em>
            </span>
          </div>

          <div className="cc-status">
            <div className="cc-dot" />
            Online
          </div>
        </header>

        {/* HERO */}
        <div className="cc-hero">
          <h1>
            Your admissions guide,
            <br />
            <em>
              always available.
            </em>
          </h1>

          <p>
            Ask anything about
            applications, deadlines,
            programs, fees, or campus
            life. Get instant answers.
          </p>

          <div className="cc-chips">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="cc-chip"
                onClick={() =>
                  sendMessage(s)
                }
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* CHAT */}
        <div className="cc-chat">
          <div className="cc-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`cc-row ${m.role}`}
              >
                <div
                  className={`cc-avatar ${m.role}`}
                >
                  {m.role === "bot"
                    ? "CC"
                    : "You"}
                </div>

                <div
                  className={`cc-bubble ${m.role}`}
                >
                  <p>{m.text}</p>

                 
                </div>
              </div>
            ))}

            {loading && (
              <div className="cc-row bot">
                <div className="cc-avatar bot">
                  CC
                </div>

                <div className="cc-bubble bot">
                  <div className="cc-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="cc-input-area">
          <div className="cc-input-wrap">
            <textarea
              ref={textareaRef}
              className="cc-textarea"
              rows={1}
              placeholder="Ask about admissions, courses, fees…"
              value={input}
              onChange={(e) => {
                setInput(
                  e.target.value
                );
                autoResize();
              }}
              onKeyDown={
                handleKeyDown
              }
              disabled={loading}
            />

            <button
              className="cc-send"
              onClick={() =>
                sendMessage()
              }
              disabled={
                loading ||
                !input.trim()
              }
              title="Send"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          <p className="cc-hint">
            Powered by AI + FAQ
            knowledge base &nbsp;·
            &nbsp; For urgent matters,
            contact the admissions
            office
          </p>
        </div>
      </div>
    </>
  );
}

