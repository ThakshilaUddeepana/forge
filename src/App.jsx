import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import DesignerPage from './pages/DesignerPage';
import TShirtSelectionPage from './pages/TShirtSelectionPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartDrawer from './components/CartDrawer';
import SizeChartPage from './pages/SizeChartPage';
import MaterialsPage from './pages/MaterialsPage';
import WhatsAppButton from './components/WhatsAppButton';
import { Toaster } from "@/components/ui/toaster";

function App() {
  const theme = useSelector((state) => state.theme.mode);

  // Apply theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customize" element={<TShirtSelectionPage />} />
        <Route path="/design" element={<DesignerPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/*" element={<ProductDetailsPage />} />
        <Route path="/size-chart" element={<SizeChartPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
      </Routes>
      <CartDrawer />
      <WhatsAppButton />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
