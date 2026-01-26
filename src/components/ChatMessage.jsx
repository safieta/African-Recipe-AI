export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      style={{
        ...styles.message,
        backgroundColor: isUser ? "#eaeaea" : "#ffffff",
        alignSelf: isUser ? "flex-end" : "flex-start",
      }}
    >
      {content}
    </div>
  );
}

const styles = {
  message: {
    maxWidth: "80%",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    whiteSpace: "pre-wrap",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
};
