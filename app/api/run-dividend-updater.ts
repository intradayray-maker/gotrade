export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://wbatyyneaiwhwbmacmkz.supabase.co/functions/v1/update-dividends-batch",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.SUPABASE_SERVICE_ROLE,
          "Content-Type": "application/json"
        }
      }
    );

    const text = await response.text();
    console.log("Supabase response:", text);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Cron error:", err);
    res.status(500).json({ error: "Cron failed" });
  }
}

// test