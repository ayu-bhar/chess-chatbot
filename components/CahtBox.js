"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatBubble from "./ChatBubble";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

const customStyles = {
  chatArea: {
    backgroundColor: "transparent",
    boxShadow: "none",
    p: 0,
    borderRadius: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: { xs: "65vh", sm: "70vh" },
  },
  chatScroll: {
    flex: 1,
    overflowY: "auto",
    "&::-webkit-scrollbar": { width: "8px" },
    "&::-webkit-scrollbar-thumb": { backgroundColor: "#302b63", borderRadius: "4px" },
    mb: 2,
    px: { xs: 0, sm: 1 },
    py: { xs: 0.5, sm: 1 },
    borderTop: { xs: "1px solid rgba(255, 255, 255, 0.1)", sm: "none" },
  },
  inputContainer: {
    display: "flex",
    gap: 1.5,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(5px)",
    borderRadius: 2,
    p: 1.5,
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "12px",
      "& fieldset": { borderColor: "transparent" },
      "&:hover fieldset": { borderColor: "#302b63" },
      "&.Mui-focused fieldset": { borderColor: "#0078ff" },
    },
  },
  sendButton: (isSm) => ({
    ml: 1,
    p: isSm ? 1 : 1.5,
    bgcolor: "#0078ff",
    color: "#fff",
    borderRadius: 2,
    "&:hover": {
      bgcolor: "#0066d6",
      boxShadow: "0 4px 10px rgba(0, 120, 255, 0.4)",
    },
    transition: "all 0.3s ease",
  }),
  loadingIndicator: {
    color: "#fff",
    mr: 1,
  },
};

export default function ChatBox() {
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // sendMessage accepts an optional textArg (used by quick prompt buttons)
  const sendMessage = async (textArg) => {
    if (!isSignedIn) {
      console.warn("User not signed in. Cannot send message.");
      return;
    }

    const text = (typeof textArg === "string" ? textArg : input).trim();
    if (!text || loading) return;

    // Append user message immediately
    const userMsg = { from: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    // Add bot placeholder with 'isStreaming' flag — UI will show "Thinking..." + loader
    setMessages((prev) => [...prev, { from: "bot", text: "", isStreaming: true }]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, userId: user?.id }),
      });

      if (!res.ok) throw new Error(`server error ${res.status}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode and accumulate the chunk
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Update the last message (bot's message) progressively and clear isStreaming on first chunk
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIdx = newMessages.length - 1;
          newMessages[lastIdx] = {
            from: "bot",
            text: accumulatedText,
            isStreaming: false, // clear thinking flag as soon as we have text
          };
          return newMessages;
        });
      }
    } catch (err) {
      console.error("chat send error:", err);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIdx = newMessages.length - 1;
        newMessages[lastIdx] = {
          from: "bot",
          text: "Network error. Please try again.",
          isStreaming: false,
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  // handler used by quick-prompt buttons
  const handleQuickPrompt = (prompt) => {
    // optionally set input for visibility, then send immediately
    setInput(prompt);
    // small timeout to ensure input state updates if you want to show it (optional)
    // here we call sendMessage directly with prompt
    sendMessage(prompt);
  };

  if (!isSignedIn) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          color: "white",
          textAlign: "center",
          mt: 4,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Sign in to unlock ChessMate ♟️
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "rgba(255, 255, 255, 0.8)" }}>
          You must be signed in to ask questions.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <SignInButton mode="modal">
            <Button variant="contained" size="large" sx={{ bgcolor: "#fff", color: "#0f0c29", "&:hover": { bgcolor: "#e0e0e0" } }}>
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outlined" size="large" sx={{ borderColor: "#fff", color: "#fff", "&:hover": { borderColor: "#ddd", bgcolor: "rgba(255,255,255,0.06)" } }}>
              Create Account
            </Button>
          </SignUpButton>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={customStyles.chatArea}>
      <Box ref={scrollRef} sx={customStyles.chatScroll}>
        {messages.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 8, color: "rgba(255, 255, 255, 0.7)" }}>
            <Typography variant="h4" sx={{ mb: 1, color: "#fff", fontWeight: 700 }}>
              How can I help you today?
            </Typography>
            <Typography variant="body1">I am ChessMate, an AI expert in all things chess. Ask me anything about openings, tactics, or history!</Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mt: 4 }}>
              <Button
                variant="outlined"
                sx={{ color: "rgba(255,255,255,0.9)", borderColor: "rgba(255,255,255,0.4)" }}
                onClick={() => handleQuickPrompt("Explain the King's Indian Defense")}
                disabled={loading}
              >
                Explain the King's Indian Defense
              </Button>

              <Button
                variant="outlined"
                sx={{ color: "rgba(255,255,255,0.9)", borderColor: "rgba(255,255,255,0.4)" }}
                onClick={() => handleQuickPrompt("What are the best moves for White in the Ruy Lopez?")}
                disabled={loading}
              >
                What are the best moves for White?
              </Button>

              <Button
                variant="outlined"
                sx={{ color: "rgba(255,255,255,0.9)", borderColor: "rgba(255,255,255,0.4)" }}
                onClick={() => handleQuickPrompt("Show me a short trap in the Sicilian Defense")}
                disabled={loading}
              >
                Short trap in the Sicilian
              </Button>
            </Box>
          </Box>
        )}

        {messages.map((msg, idx) => (
          // pass streaming flag to ChatBubble so it can show "Thinking..." + loader
          <ChatBubble key={idx} from={msg.from} text={msg.text} streaming={!!msg.isStreaming} />
        ))}

        {/* bottom thinking loader removed */}
      </Box>

      <Box sx={customStyles.inputContainer}>
        <TextField
          fullWidth
          size={isSm ? "small" : "medium"}
          variant="outlined"
          placeholder="Ask chess questions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={customStyles.textField}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={!isSignedIn || loading}
          inputProps={{ maxLength: 2000 }}
        />
        {loading ? (
          <CircularProgress size={30} sx={customStyles.loadingIndicator} />
        ) : (
          <IconButton
            color="primary"
            onClick={() => sendMessage()}
            sx={customStyles.sendButton(isSm)}
            disabled={!isSignedIn || loading || input.trim() === ""}
          >
            <SendIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
