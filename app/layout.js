import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { CssBaseline, Container, AppBar, Toolbar, Typography, Avatar, Box, Button, Paper } from "@mui/material";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chess Mate",
  description: "Ask about openings, plans and tactics",
  icons : {
    icon : '/chess.svg'
  },
  keywords: ['Chess','Chess ai','Chess assistant', 'Chess Mate', 'ai', 'chess help', 'chess play', 'chess knowledge','chess bot'],
  authors: [{ name: 'Ayush Bhardwaj', url: 'https://www.linkedin.com/in/ayush-bhardwaj-362271325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' }],
  opengraph: {
    title: 'Chess Mate',
    description: 'Ask about openings, plans and tactics',
    url: 'https://chess-chatbot.vercel.app/',
    siteName: 'Chess Mate',
    images: [
      {
        url: '/chess.svg',
        alt: 'Chess Logo',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <CssBaseline />

          <AppBar
            position="static"
            elevation={6}
            sx={{
              background:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,105,121,1) 35%, rgba(0,212,255,1) 100%)",
            }}
          >
            <Toolbar sx={{ gap: 2, px: { xs: 1, sm: 2 } }}>
              <Avatar sx={{ bgcolor: "#022d36", width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                <Image src="/chess.svg" alt="Chess Logo" layout="fill" objectFit="contain" />

              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                  Chess Mate
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.95, fontSize: { xs: "0.7rem", sm: "0.85rem" } }}>
                  Openings, plans & tactics
                </Typography>
              </Box>

              <SignedOut>
                <SignInButton>
                  <Button variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)", mr: 1, px: { xs: 1, sm: 2 } }} size="small">
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton>
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(90deg,#6c47ff,#4b2bff)",
                      color: "#fff",
                      borderRadius: "999px",
                      textTransform: "none",
                      px: { xs: 1.2, sm: 2.5 },
                    }}
                    size="small"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </Toolbar>
          </AppBar>

          <Box
            sx={{
              minHeight: "calc(100vh - 64px)",
              background: "linear-gradient(180deg,#081229 0%,#0b2940 100%)",
              py: { xs: 4, sm: 6 },
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Container maxWidth="md" sx={{ mt: 2, px: { xs: 1, sm: 2 }, width: "100%" }}>
              <Paper elevation={8} sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{ p: { xs: 1.5, sm: 3, md: 4 }, background: "#f6f9fc" }}>
                  {children}
                </Box>
              </Paper>

              <Box component="footer" sx={{ mt: 3, textAlign: "center", color: "rgba(255,255,255,0.65)" }}>
                <Typography variant="caption">© {new Date().getFullYear()} Chess Mate devloped by Ayush</Typography>
              </Box>
            </Container>
          </Box>
        </body>
      </html>
    </ClerkProvider>
  );
}

