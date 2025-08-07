import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web3 MCP Server Demo - AYA Hackathon",
  description: "Comprehensive demonstration of Web3 Model Context Protocol server capabilities across multiple blockchains including Solana, Ethereum, and more",
  keywords: ["blockchain", "Web3", "MCP", "Solana", "Ethereum", "crypto", "DeFi", "hackathon", "demo"],
  authors: [{ name: "AYA Hackathon Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Web3 MCP Server Demo",
    description: "Revolutionary Web3 Model Context Protocol server demo showcasing multi-chain capabilities",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-inter antialiased">
        <div className="min-h-screen relative overflow-x-hidden">
          {/* Animated background effects */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            
            {/* Grid pattern overlay */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            ></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}