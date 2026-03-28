import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <div className="text-6xl mb-6">💥</div>
                        <h1 className="text-3xl font-bold text-white mb-4">
                            Bir Şeyler Ters Gitti
                        </h1>
                        <p className="text-gray-400 mb-8">
                            Beklenmeyen bir hata oluştu. Sayfayı yenileyerek tekrar deneyebilirsin.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Sayfayı Yenile
                            </button>
                            <a
                                href="/"
                                className="px-8 py-3 border border-slate-700 text-gray-300 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                            >
                                Ana Sayfa
                            </a>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <pre className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-xs text-left overflow-auto max-h-40">
                                {this.state.error.toString()}
                            </pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
