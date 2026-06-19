import LoginForm from "./LoginForm";

export default function TeamLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-chalk px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-turf">
          Team Section
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wide">Sign In</h1>
        <p className="mt-2 font-mono text-xs text-ink/50">
          For players &amp; families. Use the email and temporary password
          Coach sent you.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
