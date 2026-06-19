import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function DonatePage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-2xl px-6 py-16">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-clay">
          Support the Program
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">
          Help Keep Kids on the Field
        </h1>
        <p className="mt-5 text-ink/80">
          Donations go directly toward equipment, field time, and keeping
          programs accessible for every player. Every bit helps.
        </p>

        <div className="mt-10 space-y-4">
          {settings?.donation_venmo ? (
            <a
              href={settings.donation_venmo}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-ink p-5 hover:border-clay"
            >
              <p className="font-display text-2xl tracking-wide">Venmo</p>
              <p className="mt-1 font-mono text-sm text-ink/60">
                Tap to open Venmo and send a donation
              </p>
            </a>
          ) : null}

          {settings?.donation_paypal ? (
            <a
              href={settings.donation_paypal}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-ink p-5 hover:border-clay"
            >
              <p className="font-display text-2xl tracking-wide">PayPal</p>
              <p className="mt-1 font-mono text-sm text-ink/60">
                Tap to open PayPal and send a donation
              </p>
            </a>
          ) : null}

          {!settings?.donation_venmo && !settings?.donation_paypal ? (
            <p className="font-mono text-sm text-ink/60">
              Donation links coming soon.
            </p>
          ) : null}
        </div>
      </section>
      <Footer
        contactEmail={settings?.contact_email}
        contactPhone={settings?.contact_phone}
      />
    </>
  );
}
