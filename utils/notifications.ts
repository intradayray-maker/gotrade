import { createServerClient } from "@/utils/supabase/server";
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
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  sendEmail?: boolean;
}) {
  const supabase = await createServerClient();

  // Insert in-app notification
  const { data: notif, error } = await supabase
    .from("notifications")
    .insert({
      user_id: options.userId,
      type: options.type,
      title: options.title,
      message: options.message,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to insert notification", error);
    return;
  }

  // Optional email
  if (options.sendEmail) {
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(options.userId);

    if (userError) {
      console.error("Failed to fetch user email:", userError);
    }

    const email = userData?.user?.email;

    if (email) {
      // Your patched notifyUser() takes NO arguments
      await notifyUser();
    }
  }

  return notif;
}
