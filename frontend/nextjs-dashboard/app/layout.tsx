"use client";
// gör filen till en "client component".  
// behövs för att använda useState och andra React-hooks i Next.js.

import "./ui/global.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Modal from "./components/modal/modal";
import CustomButton from "./components/CustomButton/CustomButton";

type ModalType = "add-friends" | "discover-friends" | null;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isOpen, setIsOpen] = useState(false); 
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setModalOpen(true);
  };

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
      <li> <CustomButton buttonText={"Add Friends"} onClick={() => openModal("add-friends")} /></li>
      <li> <CustomButton buttonText={"Discover Friends"} onClick={() => openModal("discover-friends")} /></li>
    </ul>
  )}
{/* gör modal dynamisk sen */}
{modalOpen && (
  <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
    {activeModal === "add-friends" && (
      <div>
        <h2>Add Friends</h2>
        <p>Here you can add friends.</p>
      </div>
    )}
    {activeModal === "discover-friends" &&(
      <div>
        <h2>Discover new friends</h2>
        <p>Here you can discover new friends</p>
      </div>
    )}
  </Modal>
)}

</nav>
        <main>
          {children}
          <div id="modal-root"></div>
        </main>
      </body>
    </html>
  );
}
