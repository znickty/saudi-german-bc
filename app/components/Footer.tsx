import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="pattern-bg brown" aria-hidden />
      <div className="container">
        <div className="footer-row">
          <div className="footer-logo">
            <Image src="/logo.png" alt="SGBC" width={200} height={100} />
          </div>
          <span style={{ fontWeight: 500, letterSpacing: ".02em" }}>
            German Excellence. Saudi Opportunity. Regional Growth.
          </span>
        </div>
        <p>
          Our purpose is to create enduring bilateral partnerships that combine German
          industrial excellence with Saudi Arabia's investment capacity, market growth,
          strategic location and determination to build a diversified and internationally
          competitive economy.
        </p>
        <div className="footer-row">
          <p>© {new Date().getFullYear()} Saudi German Business Council. All rights reserved.</p>
          <p>
            <a href="#investor-form">German Investor Interest</a> · <a href="#membership">Membership</a>
          </p>
        </div>
      </div>
    </footer>
  );
}