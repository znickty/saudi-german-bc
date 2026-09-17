export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-row">
          <strong style={{ fontSize: "1.2rem" }}>Saudi German Business Council</strong>
          <span style={{ fontWeight: 300 }}>German Excellence. Saudi Opportunity. Regional Growth.</span>
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