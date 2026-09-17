import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link href="/" className="logo" aria-label="Saudi German Business Council">
          <Image
            src="/logomark.png"
            alt="Saudi German Business Council"
            width={200}
            height={54}
            priority
          />
          <div className="logo-text">
            <span className="en">Saudi German Business Council</span>
            <span className="ar">مجلس الأعمال السعودي الألماني</span>
          </div>
        </Link>
        <nav className="nav-links">
          <a href="#why-saudi">Why Saudi</a>
          <a href="#pathways">Pathways</a>
          <a href="#support">How We Help</a>
          <a href="#membership">Membership</a>
          <a href="#investor-form" className="nav-cta">Submit Investor Interest</a>
        </nav>
      </div>
    </header>
  );
}