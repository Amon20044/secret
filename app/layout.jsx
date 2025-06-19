import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata = {
  title: 'Three21.go - AI-Powered 3D Engineering Explorer',
  description: 'Revolutionary WebGPU 3D model viewer with AI assistant and hand gesture controls for engineering education and exploration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} bg-deep-black text-white font-inter`}>
        {children}
      </body>
    </html>
  );
}