import { MotionConfig } from "framer-motion";
import {
  DiagnosticBookingProvider,
  useDiagnosticBooking,
} from "./context/DiagnosticBookingContext";
import { SummitScrollProgress } from "./components/MotionPrimitives";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ManifestoSection } from "./components/ManifestoSection";
import { ProductShowcases } from "./components/ProductShowcases";
import { FaqAndFooter } from "./components/FaqAndFooter";
import { DiagnosticPortalPage } from "./pages/DiagnosticPortalPage";
import { AdminBackendPage } from "./pages/AdminBackendPage";

function AppShell() {
  const { activeRoute } = useDiagnosticBooking();

  if (activeRoute === "diagnostic") {
    return <DiagnosticPortalPage />;
  }

  if (activeRoute === "admin") {
    return <AdminBackendPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919] relative">
      <SummitScrollProgress />
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <ManifestoSection />
        <ProductShowcases />
      </main>

      <FaqAndFooter />
    </div>
  );
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <DiagnosticBookingProvider>
        <AppShell />
      </DiagnosticBookingProvider>
    </MotionConfig>
  );
}

export default App;
