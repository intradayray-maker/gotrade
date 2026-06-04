import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notifyUser } from "@/utils/email/notifyUser";

export type NotificationType =
  | "fee_crystallized"
  | "invoice_created"
  | "invoice_failed"
  | "equity_alert"
  | "system_warning"
  | "master_trade_executed"
  | "follower_trade_executed"
  | "follower_trade_failed";

export async function sendNotification(options: {
  userId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  sendEmail?: boolean;
}) {
  const supabase = await createSupabaseServerClient();

  // Insert in-app notification
  const { data: notif, error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: options.userId ?? null,   // ✅ always valid
        type: options.type,
        title: options.title,
        message: options.message,
      },
    ] as any)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to insert notification", error);
    return;
  }

  // Optional email — ONLY if userId is a real UUID
  if (options.sendEmail && options.userId) {
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(options.userId);

    if (userError) {
      console.error("Failed to fetch user email:", userError);
    }

    const email = userData?.user?.email;

    if (email) {
      await notifyUser(); // your patched version takes no args
    }
  }

  return notif;
}
