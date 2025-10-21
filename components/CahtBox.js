"use client";

import { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Paper, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatBubble from "./ChatBubble";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function ChatBox() {
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!isSignedIn) return;
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, userId: user?.id }),
      });

      if (!res.ok) {
        throw new Error(`server error ${res.status}`);
      }

      const data = await res.json();
      const botText = data?.answer ?? "Sorry, I couldn't get an answer.";
      setMessages((prev) => [...prev, { from: "bot", text: botText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "bot", text: "Network error. Please try again." }]);
      console.error("chat send error:", err);
    } finally {
      setLoading(false);
    }
  };

  // when not signed in, show a prompt that prevents chat usage
  if (!isSignedIn) {
    return (
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, width: "100%", maxWidth: { xs: "100%", sm: 720 } }}>
        <Typography variant="h6" gutterBottom>
          Sign in to chat with ChessMate
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          You must be signed in to ask questions. Your unique user id will be sent with each request.
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <SignInButton>
            <Button variant="outlined" size={isSm ? "small" : "medium"}>Sign in</Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="contained" size={isSm ? "small" : "medium"}>Create account</Button>
          </SignUpButton>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 1.5, sm: 2.5 },
        borderRadius: 2,
        width: "100%",
        maxWidth: { xs: "100%", sm: 720 },
        height: { xs: "70vh", sm: 520 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          mb: 2,
          pr: 1,
          px: { xs: 0.5, sm: 1.5 },
          py: { xs: 0.5, sm: 1 },
        }}
      >
        {messages.length === 0 && (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            You can ask any question about chess openings, strategies, and tactics.
            <br />
            Try asking about popular openings like the Sicilian Defense or the Ruy Lopez!
          </Typography>
        )}
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} from={msg.from} text={msg.text} />
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          fullWidth
          size={isSm ? "small" : "medium"}
          variant="outlined"
          placeholder="Ask chess questions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ borderRadius: 1, backgroundColor: "#fff" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={!isSignedIn || loading}
          inputProps={{ maxLength: 2000 }}
        />
        <IconButton
          color="primary"
          onClick={sendMessage}
          sx={{
            ml: 1,
            p: isSm ? 1 : 1.25,
            width: isSm ? 44 : 48,
            height: isSm ? 44 : 48,
            bgcolor: "#0078ff",
            color: "#fff",
            "&:hover": { bgcolor: "#0066d6" },
          }}
          disabled={!isSignedIn || loading}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
