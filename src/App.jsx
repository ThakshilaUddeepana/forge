import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SpeedInsights } from '@vercel/speed-insights/react';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import { Toaster } from "@/components/ui/toaster";

// Lazy-load all page components for route-based code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const TShirtSelectionPage = lazy(() => import('./pages/TShirtSelectionPage'));
const DesignerPage = lazy(() => import('./pages/DesignerPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const SizeChartPage = lazy(() => import('./pages/SizeChartPage'));
const MaterialsPage = lazy(() => import('./pages/MaterialsPage'));

// Minimal loading spinner
const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm font-medium tracking-wider uppercase">Loading...</p>
    </div>
  </div>
);

function App() {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customize" element={<TShirtSelectionPage />} />
          <Route path="/design" element={<DesignerPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/*" element={<ProductDetailsPage />} />
          <Route path="/size-chart" element={<SizeChartPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
        </Routes>
      </Suspense>
      <CartDrawer />
      <WhatsAppButton />
      <Toaster />
      <SpeedInsights />
    </BrowserRouter>
  );
}

export default App;
