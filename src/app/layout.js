import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { MuteProvider } from '../games/components/context/MuteContext';

export const metadata = {
  title: 'Altseason Token - Bull Run Clicker',
  description: 'How high can you pump the market cap?',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <MuteProvider>
            {children}
          </MuteProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}