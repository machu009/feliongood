export default function Footer({ contactEmail, contactPhone }) {
  return (
    <footer className="mt-20 border-t-4 border-ink bg-ink text-chalk">
      <div className="mx-auto max-w-5xl px-6 py-10 font-mono text-sm">
        <p className="font-display text-xl tracking-wide text-brass">
          FELION GOOD BASEBALL
        </p>
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-chalk/80">
          {contactEmail ? <span>{contactEmail}</span> : null}
          {contactPhone ? <span>{contactPhone}</span> : null}
        </div>
        <p className="mt-6 text-chalk/50">
          &copy; {new Date().getFullYear()} Felion Good Baseball
        </p>
      </div>
    </footer>
  );
}
