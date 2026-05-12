import { createServerClient } from "@/utils/supabase/server";
import { notifyUser } from "@/utils/email/notifyUser";
import type { NotificationType } from "@/utils/notifications/types"; // adjust path if needed

export async function sendNotification(options: {
  userId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  sendEmail?: boolean;
}) {
  const supabase = await createServerClient();

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

  // Only send email if userId exists
  if (options.sendEmail && options.userId) {
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(options.userId);

    if (userError) {
      console.error("Failed to fetch user email:", userError);
    }

    const email = userData?.user?.email;

    if (email) {
      await notifyUser();
    }
  }

  return notif;
}
