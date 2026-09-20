import Image from "next/image";

type FooterDict = {
  purpose: string;
  rights: string;
  investorLink: string;
  membershipLink: string;
};

export default function Footer({
  t,
  tagline,
}: {
  t: FooterDict;
  tagline: string;
}) {
  return (
    <footer className="footer">
      <div className="pattern-bg brown" aria-hidden />
      <div className="container">
        <div className="footer-row">
          <div className="footer-logo">
            <Image src="/logo.png" alt="SGBC" width={200} height={60} />
          </div>
          <span style={{ fontWeight: 500, letterSpacing: ".02em" }}>{tagline}</span>
        </div>
        <p>{t.purpose}</p>
        <div className="footer-row">
          <p>© {new Date().getFullYear()} Saudi German Business Council. {t.rights}</p>
          <p>
            <a href="#investor-form">{t.investorLink}</a> · <a href="#membership">{t.membershipLink}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}