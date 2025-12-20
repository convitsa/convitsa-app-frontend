import type { Metadata } from 'next';
import { StoreProvider } from '@/lib/store/provider';
import ToastContainer from '@/components/ui/ToastContainer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Convitsa - AI Engine Optimization',
  description: 'Optimize your website for AI engines with Convitsa AIEO platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <StoreProvider>
          {children}
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
