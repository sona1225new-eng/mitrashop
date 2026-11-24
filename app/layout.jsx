import "../styles.css";
import "../landing-page-two.css";

export const metadata = {
  title: "Mitra Shop — Ideas into reality",
  description: "Discover thoughtfully selected electronics, maker kits, and components at Mitra Shop.",
};

export const viewport = {
  themeColor: "#f4f7f6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body id="top">{children}</body>
    </html>
  );
}
