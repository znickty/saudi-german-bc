import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link href="/" className="logo">
          <Image src="/logomark.png" alt="Saudi German Business Council" width={52} height={52} />
          <span>Saudi German Business Council</span>
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