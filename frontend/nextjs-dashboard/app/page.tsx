"use client";

import Image from "next/image";
import { useState } from "react";
import Modal from "./components/modal/modal";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main>
      <Image src="/logo.png" alt="logo" width={300} height={300} />

      <button onClick={() => setIsOpen(true)}>Open</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>Hi</p>
      </Modal>
    </main>
  );
}
