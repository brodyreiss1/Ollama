import React, { useState } from "react";
import { sendMessageToApi } from "../api/chatApi";
import CollapseSection from "./CollapseSection";
import ExplanationText from "./ExplanationText";
import CodeBlock from "./CodeBlock";

const ChatBox = () => {
  const [messages, setMessages] = useState([{ role: "user", content: "" }]);
  const [responseSections, setResponseSections] = useState([]);
  const [streaming, setStreaming] = useState(false);

  const handleChange = (e) => {
    const updatedMessages = [...messages];
    updatedMessages[0] = { ...updatedMessages[0], content: e.target.value };
    setMessages(updatedMessages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStreaming(true);
    setResponseSections([]); // Clear previous responses

    try {
      const reader = await sendMessageToApi(messages);
      const decoder = new TextDecoder();
      let receivedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        receivedText += decoder.decode(value, { stream: true });

        // Dynamically process the response text to identify the type of section
        const sections = parseApiResponse(receivedText);
        setResponseSections(sections);
      }

      setStreaming(false);
    } catch (error) {
      console.error("Streaming error:", error);
      setStreaming(false);
    }
  };

  // Function to parse response into categorized sections
  const parseApiResponse = (responseText) => {
    const lines = responseText.split("\n").filter((line) => line.trim() !== "");

    return lines.map((line) => {
      if (line.startsWith("<think>")) {
        return {
          type: "thinking",
          content: line.replace("<think>", "").trim(),
        };
      } else if (line.startsWith("```")) {
        return { type: "code", content: line.replace("```", "").trim() };
      } else {
        return { type: "explanation", content: line.trim() };
      }
    });
  };

  return (
    <div className="chat-box">
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          value={messages[0]?.content || ""}
          onChange={handleChange}
          placeholder="Type your message..."
        />
        <button type="submit" disabled={streaming}>
          {streaming ? "Streaming..." : "Send"}
        </button>
      </form>

      {/* Render dynamic response sections */}
      {responseSections.map((section, index) => {
        if (section.type === "thinking") {
          return (
            <CollapseSection key={index} title="Thinking...">
              <ExplanationText text={section.content} />
            </CollapseSection>
          );
        } else if (section.type === "code") {
          return <CodeBlock key={index} code={section.content} />;
        } else {
          return <ExplanationText key={index} text={section.content} />;
        }
      })}
    </div>
  );
};

export default ChatBox;
