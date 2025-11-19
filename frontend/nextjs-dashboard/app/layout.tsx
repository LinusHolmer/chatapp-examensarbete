"use client";
// gör filen till en "client component".  
// behövs för att använda useState och andra React-hooks i Next.js.

import "./ui/global.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isOpen, setIsOpen] = useState(false); 

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

  {/* Hamburgar meny-knapp */}
  <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
    <div className={`line ${isOpen ? "open" : ""}`}></div>
    <div className={`line ${isOpen ? "open" : ""}`}></div>
    <div className={`line ${isOpen ? "open" : ""}`}></div>
  </button>

  {/* Menyn som fälls ut */}
  {isOpen && (
    <ul className="mobile-menu">
      <li><Link href="/add-friends" onClick={() => setIsOpen(false)} >Lägg till vänner</Link></li>
      <li><Link href="/explore" onClick={() => setIsOpen(false)} >Upptäck
      </Link></li>
    </ul>
  )}
</nav>


        <main>{children}</main>
      </body>
    </html>
  );
}
