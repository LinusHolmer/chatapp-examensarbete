
import Image from 'next/image'

export default function Page() {
  return (
    <main>
      <Image
        src="/logo.png"  
        alt="logo"
        width={300}                 
        height={300}
      />
     
    </main>
  );
}
