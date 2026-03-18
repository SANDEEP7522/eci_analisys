import '../../styles/globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import Sidebar from '@/components/layout/Sidebar';

export const metadata = {
  title: 'ECI Election Analytics Dashboard',
  description: 'Election Commission of India — General Elections 2024',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground flex h-screen overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Sidebar />
          {/* On mobile, add top padding because of fixed header (56px) */}
          <main className="flex-1 overflow-y-auto pt-14 md:pt-0 bg-background">
            <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
