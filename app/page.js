"use client";

import { Typography, Box, Paper } from "@mui/material";
// FIX: Corrected typo from 'CahtBox' to 'ChatBox'
import ChatBox from "../components/CahtBox";

export default function Home() {
  return (
    <Box
      sx={{
        // 1. Ensure full viewport height
        minHeight: "100vh", 
        // 2. Deeper, more balanced dark gradient for an attractive AI theme
        background: 
          "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", 
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Main Content Container: Applies a wider maximum width for readability and balance */}
      <Box 
        sx={{ 
          width: "100%", 
          maxWidth: 1024, // Wider content area for the "full view" feel
          display: "flex",
          flexDirection: "column",
          flexGrow: 1, 
        }}
      >
        <Paper
          elevation={10} // Increased elevation for visual depth
          sx={{
            p: 4, 
            mb: 4,
            width: "100%", // Now takes the full 1024px width
            borderRadius: 3, 
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)", // Nearly opaque for contrast
            // Added a modern shadow effect for attractiveness
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.5)', 
          }}
        >
          <Typography variant="h3" gutterBottom color="primary" sx={{ fontWeight: 700 }}>
            ChessMate
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Ask your chess questions and learn from the AI Chess expert!
          </Typography>
        </Paper>

        {/* The ChatBox area stretches to take the remaining vertical and horizontal space */}
        <Box sx={{ flexGrow: 1, width: '100%', minHeight: '60vh' }}>
            <ChatBox />
        </Box>
      </Box>
    </Box>
  );
}
