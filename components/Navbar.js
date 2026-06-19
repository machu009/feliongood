import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="border-b-4 border-ink bg-chalk">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-ink">
            <Image
              src="/logo-mark.jpg"
              alt="Felion Good Baseball emblem"
              fill
              className="object-cover"
              sizes="40px"
            />
          </span>
          <span className="font-display text-3xl tracking-wide text-ink">
            FELION GOOD <span className="text-clay">BASEBALL</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-sm uppercase tracking-wide text-ink">
          <Link href="/programs" className="hover:text-clay">
            Programs
          </Link>
          <Link href="/donate" className="hover:text-clay">
            Donate
          </Link>
        </nav>
      </div>
    </header>
  );
}
