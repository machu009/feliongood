import nodemailer from "nodemailer";
import { createClient } from "@/lib/supabase/server";

// Configure your email service
// For local SMTP (Postfix/Sendmail):
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: process.env.SMTP_PORT || 25,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

export async function sendPracticeReminders() {
  const supabase = createClient();

  // Get all practices that are tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  const { data: practices } = await supabase
    .from("practices")
    .select("*, practice_attendance(*, players(*))")
    .eq("practice_date", tomorrowString)
    .eq("is_cancelled", false);

  if (!practices || practices.length === 0) {
    console.log("No practices scheduled for tomorrow");
    return;
  }

  // Get all active players' emails
  const { data: players } = await supabase
    .from("players")
    .select("id, full_name")
    .eq("is_active", true);

  // Get parent emails from signups (if available)
  const { data: signups } = await supabase
    .from("signups")
    .select("email, player_name");

  // Create email map for players
  const playerEmailMap = {};
  signups?.forEach((signup) => {
    playerEmailMap[signup.player_name] = signup.email;
  });

  // Send email for each practice
  for (const practice of practices) {
    const emailList = signups?.map((s) => s.email) || [];

    if (emailList.length === 0) {
      console.log("No parent emails found for practice reminders");
      continue;
    }

    const practiceTime = practice.start_time;
    const duration = practice.duration_minutes || 90;
    const endTime = calculateEndTime(practiceTime, duration);

    const gearInfo = practice.special_gear
      ? `\n\n📦 Please bring:\n${practice.special_gear}`
      : "";

    const locationInfo = practice.location
      ? `\nLocation: ${practice.location}`
      : "";

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2d5016;">Practice Reminder</h1>
            
            <div style="background-color: #f0f9f0; border-left: 4px solid #2d5016; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${formatDateLong(tomorrowString)}</p>
              <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${practiceTime} - ${endTime}</p>
              ${locationInfo ? `<p style="margin: 0;">${locationInfo}</p>` : ""}
            </div>

            ${
              gearInfo
                ? `
              <div style="background-color: #fff8e1; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Don't forget:</strong></p>
                <p style="margin: 10px 0 0 0; white-space: pre-line;">${practice.special_gear}</p>
              </div>
            `
                : ""
            }

            ${
              practice.notes
                ? `
              <div style="background-color: #f3f4f6; border-left: 4px solid #6b7280; padding: 16px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Coach Notes:</strong></p>
                <p style="margin: 10px 0 0 0; white-space: pre-line;">${practice.notes}</p>
              </div>
            `
                : ""
            }

            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              See you tomorrow! - Coach Felion and the Granger Lancers
            </p>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Practice Reminder - Tomorrow!

Date: ${formatDateLong(tomorrowString)}
Time: ${practiceTime} - ${endTime}
${locationInfo}

${gearInfo}

${practice.notes ? `Coach Notes:\n${practice.notes}` : ""}

See you tomorrow! - Coach Felion and the Granger Lancers
    `.trim();

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@feliongood.com",
        to: emailList.join(","),
        subject: `🏏 Practice Tomorrow: ${formatDateShort(tomorrowString)}`,
        text: textContent,
        html: htmlContent,
      });

      console.log(
        `Sent practice reminder for ${tomorrowString} to ${emailList.length} recipients`
      );
    } catch (err) {
      console.error(`Failed to send practice reminder for ${tomorrowString}:`, err);
    }
  }
}

// Utility functions
function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startDate = new Date(0, 0, 0, hours, minutes);
  startDate.setMinutes(startDate.getMinutes() + durationMinutes);

  const endHours = String(startDate.getHours()).padStart(2, "0");
  const endMinutes = String(startDate.getMinutes()).padStart(2, "0");
  return `${endHours}:${endMinutes}`;
}

function formatDateLong(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
