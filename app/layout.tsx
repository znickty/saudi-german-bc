// Root layout just passes through — the [lang] layout provides html/body.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}