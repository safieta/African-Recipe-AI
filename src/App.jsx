import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Bonjour 👋\nJe suis SavouraBot 🍲\nPose-moi une question ou demande une recette.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ ENVOI MESSAGE AU BACKEND FASTAPI
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      // const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://savourabot-backend-1.onrender.com";
      // const res = await fetch(`${backendUrl}/api/chat`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ message: text }),
      // });

      // if (!res.ok) {
      //   throw new Error("Erreur serveur");
      // }
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        throw new Error("VITE_BACKEND_URL non définie");
      }

      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }


      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Impossible de contacter le serveur.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // (Optionnel) gestion fichier
  const sendFile = async (file) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `📎 Fichier envoyé : ${file.name}` },
    ]);
  };

  return (
    <div style={styles.app}>
      <Header />

      <main style={styles.chat}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}

        {loading && (
          <div style={styles.loading}>💭 SavouraBot réfléchit...</div>
        )}

        <div ref={bottomRef} />
      </main>

      <ChatInput onSend={sendMessage} onFileSend={sendFile} />
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#FFF8F0",
  },
  chat: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  loading: {
    fontStyle: "italic",
    color: "#7A4A00",
    margin: "6px 0",
  },
};
