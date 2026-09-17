import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BeyondTrade from "./components/BeyondTrade";
import WhySaudi from "./components/WhySaudi";
import Pathways from "./components/Pathways";
import CouncilSupport from "./components/CouncilSupport";
import AfterSubmission from "./components/AfterSubmission";
import InvestorForm from "./components/InvestorForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BeyondTrade />
        <WhySaudi />
        <Pathways />
        <CouncilSupport />
        <AfterSubmission />
        <InvestorForm />
      </main>
      <Footer />
    </>
  );
}