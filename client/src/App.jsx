import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

// Bileşenler
import Navbar from './components/common/Navbar';
import ScrollProgress from './components/common/ScrollProgress';
import CustomCursor from './components/common/CustomCursor';
import ScrollToTop from './components/common/ScrollToTop';
import Footer from './components/common/Footer';
import Preloader from './components/common/Preloader';

// Sayfalar
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Projects from './pages/Projects/Projects';
import Blog from './pages/Blog/Blog';
import Contact from './pages/Contact/Contact';
import ProjectDetails from './pages/Projects/ProjectDetails';
import AddProject from './pages/Admin/AddProject';
import AdminDashboard from './pages/Admin/AdminDashboard';
import BlogDetails from './pages/Blog/BlogDetails';
import NotFound from './pages/NotFound';
import Login from './pages/Admin/Login';
import ProtectedRoute from './components/common/ProtectedRoute';

// Animasyon Sarmalayıcısı
const PageWrapper = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
};

// Rotalar
const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
                <Route path="/projects/:id" element={<PageWrapper><ProjectDetails /></PageWrapper>} />
                <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
                <Route path="/blog/:id" element={<PageWrapper><BlogDetails /></PageWrapper>} />
                <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                <Route path="/admin/add-project" element={<PageWrapper><AddProject /></PageWrapper>} />
                {/* --- ADMIN ROTALARI --- */}

                {/* Login Sayfası (Herkese Açık) */}
                <Route path="/admin/login" element={<PageWrapper><Login /></PageWrapper>} />

                {/* Dashboard (Korumalı) */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <PageWrapper>
                            <ProtectedRoute> {/* <-- KORUMA KALKANI */}
                                <AdminDashboard />
                            </ProtectedRoute>
                        </PageWrapper>
                    }
                />

                {/* Eski Proje Ekleme Sayfası (Bunu da korumaya alalım varsa) */}
                <Route
                    path="/admin/add-project"
                    element={
                        <PageWrapper>
                            <ProtectedRoute>
                                <AddProject />
                            </ProtectedRoute>
                        </PageWrapper>
                    }
                />
                <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    const [loading, setLoading] = useState(true);

    return (
        <div className="min-h-screen bg-[#0B1120] text-gray-100 font-sans selection:bg-blue-500 selection:text-white cursor-none md:cursor-auto">

            <AnimatePresence>
                {loading && <Preloader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            <ScrollProgress />
            <CustomCursor />

            <Router>
                <ScrollToTop />
                <Navbar />
                <div className="pt-20">
                    <AnimatedRoutes />
                </div>
                <Footer />
            </Router>
        </div>
    );
}

export default App;