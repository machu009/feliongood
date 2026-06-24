// app/api/cron/practice-reminders/route.js
import { sendPracticeReminders } from "@/lib/email-notifications";

export async function GET(request) {
  // Verify this is from your cron service
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuth) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log("Running practice reminder cron job...");
    await sendPracticeReminders();
    return new Response("Practice reminders sent successfully", { status: 200 });
  } catch (err) {
    console.error("Error sending practice reminders:", err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}

export const config = {
  maxDuration: 60, // 60 seconds
};
