"use client";
// gör filen till en "client component".  
// behövs för att använda useState och andra React-hooks i Next.js.

import "./ui/global.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
