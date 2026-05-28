import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent/30 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
