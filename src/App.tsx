import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Navigation from './components/Navigation';
import Register from './pages/Register';
import Index from './pages/Index';
import Discover from './pages/Discover';
import Characters from './pages/Characters';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;