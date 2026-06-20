import Image from "next/image";

export default function Footer({ contactEmail, contactPhone }) {
  return (
    <footer className="mt-20 border-t-4 border-ink bg-ink text-chalk">
      <div className="mx-auto max-w-5xl px-4 py-8 font-mono text-sm sm:px-6 sm:py-10">
        <div className="flex items-center gap-3">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-chalk/30">
            <Image
              src="/logo-mark.jpg"
              alt="Felion Good Baseball emblem"
              fill
              className="object-cover"
              sizes="36px"
            />
          </span>
          <p className="font-display text-xl tracking-wide text-chalk">
            FELION GOOD BASEBALL
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-chalk/80">
          {contactEmail ? <span>{contactEmail}</span> : null}
          {contactPhone ? <span>{contactPhone}</span> : null}
        </div>
        <p className="mt-6 text-chalk/50">
          &copy; {new Date().getFullYear()} Felion Good Baseball
        </p>
        <p className="mt-2 text-chalk/40">
          Built by{" "}
          <a
            href="https://mad-garage.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-chalk/60 underline hover:text-chalk"
          >
            MAD-Garage.com
          </a>
        </p>
      </div>
    </footer>
  );
}
