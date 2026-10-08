import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white py-10 mt-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Image src="/logo.svg" alt="JAR Solutions" width={130} height={36} className="h-8 w-auto" />
        <p className="text-stone-400 text-sm">© 2026 JAR Solutions. Built on Faith • All rights reserved.</p>
      </div>
    </footer>
  );
}
