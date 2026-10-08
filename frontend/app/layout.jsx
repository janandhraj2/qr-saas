import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'JAR Solutions - QR Code Generator SaaS',
  description: 'Create beautiful QR codes for your business. Powered by JAR Solutions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <I18nProvider>
            <Navbar />
            {children}
            <Footer />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
