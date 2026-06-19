import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-chalk px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-clay">
          Coach Admin
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wide">Sign In</h1>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
