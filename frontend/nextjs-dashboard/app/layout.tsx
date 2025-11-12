import "./ui/global.css";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="nav-logo">
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={200}
              priority
            />
          </Link>

          <ul className="nav-links">
            <li><Link href="/add friends">Lägg till vänner</Link></li>
            
          </ul>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}
