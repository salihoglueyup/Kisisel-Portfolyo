import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

// Bileşenler (her zaman yüklenir)
import Navbar from './components/common/Navbar';
import ScrollProgress from './components/common/ScrollProgress';
import CustomCursor from './components/common/CustomCursor';
import ScrollToTop from './components/common/ScrollToTop';
import Footer from './components/common/Footer';
import Preloader from './components/common/PreLoader';
import CommandPalette from './components/common/CommandPalette';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import { CommandPaletteProvider } from './context/CommandPaletteContext';

// Sayfalar (lazy loading — code-splitting ile ilk yükleme hızını artırır)
const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const ProjectDetails = lazy(() => import('./pages/Projects/ProjectDetails'));
const Blog = lazy(() => import('./pages/Blog/Blog'));
const BlogDetails = lazy(() => import('./pages/Blog/BlogDetails'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Login = lazy(() => import('./pages/Admin/Login'));
const ForgotPassword = lazy(() => import('./pages/Admin/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Admin/ResetPassword'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AddProject = lazy(() => import('./pages/Admin/AddProject'));
const NotFound = lazy(() => import('./pages/NotFound'));

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

                {/* --- ADMIN ROTALARI --- */}

                {/* Login Sayfası (Herkese Açık) */}
                <Route path="/admin/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/admin/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
                <Route path="/admin/reset-password/:token" element={<PageWrapper><ResetPassword /></PageWrapper>} />

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

                {/* Proje Ekleme Sayfası (Korumalı) */}
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
        <div className="min-h-screen bg-base text-gray-100 font-sans selection:bg-blue-500 selection:text-white cursor-none md:cursor-auto">
            <Toaster 
                position="top-right" 
                toastOptions={{ 
                    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
                    success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
                }} 
            />

            <AnimatePresence>
                {loading && <Preloader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            <ScrollProgress />
            <CustomCursor />

            <Router>
                <CommandPaletteProvider>
                    <ScrollToTop />
                    <CommandPalette />
                    <Navbar />
                    <div className="pt-20">
                        <ErrorBoundary>
                            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
                                <AnimatedRoutes />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                    <Footer />
                </CommandPaletteProvider>
            </Router>
        </div>
    );
}

export default App;