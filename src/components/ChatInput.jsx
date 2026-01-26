import { useState, useEffect, useRef } from "react";
import { FiPlus, FiMic } from "react-icons/fi";
import { IoSendSharp } from "react-icons/io5";

export default function ChatInput({ onSend, onFileSend }) {
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [listening, setListening] = useState(false);
  const textareaRef = useRef(null);

  // Ajuste la hauteur automatiquement
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  // Prévisualisation image
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleSend = () => {
    if (file) {
      onFileSend(file);
      setFile(null);
      setPreview(null);
    } else if (value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Reconnaissance vocale non supportée sur ce navigateur.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setValue(prev => prev + transcript);
    };

    recognition.start();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.inputBox}>
        {/* Bouton + uploader */}
        <label style={styles.iconButton}>
          <FiPlus size={20} />
          <input
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </label>

        {/* Zone texte dynamique */}
        <textarea
          ref={textareaRef}
          placeholder="Écris ta demande de recette africaine..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          style={styles.textarea}
        />

        {/* Bouton micro */}
        <button
          onClick={handleMicClick}
          style={{
            ...styles.iconButton,
            backgroundColor: listening ? "#ff4b4b" : "#e5e5e5",
          }}
        >
          <FiMic size={20} />
        </button>

        {/* Bouton envoyer */}
        <button
          onClick={handleSend}
          style={{
            ...styles.iconButton,
            backgroundColor: "#000",
            color: "#fff",
            opacity: value.trim() || file ? 1 : 0.5,
            cursor: value.trim() || file ? "pointer" : "not-allowed",
          }}
          disabled={!value.trim() && !file}
        >
          <IoSendSharp size={20} />
        </button>
      </div>

      {/* Aperçu image ou nom fichier */}
      {file && (
        <div style={styles.previewContainer}>
          {preview ? (
            <img src={preview} alt="preview" style={styles.previewImage} />
          ) : (
            <div style={styles.fileName}>📎 {file.name}</div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "12px",
    backgroundColor: "#f7f7f8",
    borderTop: "1px solid #e5e5e5",
  },
  inputBox: {
    maxWidth: "768px",
    margin: "0 auto",
    display: "flex",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#e5e5e5",
    border: "none",
    marginLeft: "4px",
    marginRight: "4px",
    cursor: "pointer",
    position: "relative",
  },
  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    opacity: 0,
    cursor: "pointer",
  },
  textarea: {
    flex: 1,
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: "15px",
    fontFamily: "inherit",
    backgroundColor: "transparent",
    minHeight: "48px",
    maxHeight: "200px",
    padding: "6px",
    borderRadius: "12px",
    overflowY: "auto",
  },
  previewContainer: {
    maxWidth: "768px",
    margin: "4px auto 0",
  },
  previewImage: {
    maxHeight: "120px",
    borderRadius: "12px",
    display: "block",
  },
  fileName: {
    fontSize: "13px",
    color: "#333",
  },
};
