import '../../styles/globals.css';
import { ThemeContextProvider } from '@/context/ThemeContext';

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
      <body className="antialiased overflow-y-auto lg:overflow-hidden lg:h-screen flex flex-col">
        <ThemeContextProvider defaultTheme="dark">
          {children}
        </ThemeContextProvider>
      </body>
    </html>
  );
}
