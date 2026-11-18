/* =========================================================
   Vercel serverless function — POST /api/lead
   Sends the lead by email through Resend.

   Vercel → Project → Settings → Environment Variables:
     RESEND_API_KEY  = re_xxx                         (required)
     LEAD_TO         = sales@example.com,other@x.com  (required, comma-separated)
     LEAD_FROM       = LandMark Leads <leads@leads.mohabdo.com>  (optional)
   ========================================================= */
const FIELDS = [
  ["name", "الاسم"],
  ["phone", "الموبايل"],
  ["country", "الدولة"],
  ["project", "المشروع"],
  ["unitType", "نوع الوحدة"],
  ["detail", "التفاصيل"],
  ["page", "الصفحة"],
  ["landing", "صفحة الدخول"],
  ["utm_source", "utm_source"],
  ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"],
  ["utm_term", "utm_term"],
  ["utm_content", "utm_content"],
  ["gclid", "gclid"],
  ["gbraid", "gbraid"],
  ["wbraid", "wbraid"],
];

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (_) { b = {}; } }
  b = b || {};

  if (b.website) return res.status(200).json({ ok: true }); // honeypot

  const data = {};
  FIELDS.forEach(([k]) => { if (b[k]) data[k] = String(b[k]).trim().slice(0, 300); });
  data.phone = (data.phone || "").replace(/[^\d+]/g, "");

  if (!data.name || data.name.length < 2 || data.phone.replace(/\D/g, "").length < 8) {
    return res.status(400).json({ ok: false, error: "invalid" });
  }

  const key = process.env.RESEND_API_KEY;
  const to = (process.env.LEAD_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !to.length) return res.status(500).json({ ok: false, error: "not_configured" });

  const time = new Date().toLocaleString("en-GB", { timeZone: "Africa/Cairo" });
  const rows = FIELDS.filter(([k]) => data[k])
    .map(([k, label]) => `<tr><td style="padding:8px 12px;background:#f4f3f1;font-weight:700;white-space:nowrap">${label}</td><td style="padding:8px 12px">${esc(data[k])}</td></tr>`)
    .join("");
  const waNum = data.phone.replace(/\D/g, "");

  const html = `
  <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;color:#26282a">
    <h2 style="margin:0 0 12px">ليد جديد – ${esc(data.project || "LandMark")}</h2>
    <table style="border-collapse:collapse;border:1px solid #e4e3e0">${rows}
      <tr><td style="padding:8px 12px;background:#f4f3f1;font-weight:700">الوقت</td><td style="padding:8px 12px">${time} (Cairo)</td></tr>
    </table>
    <p style="margin:16px 0 0"><a href="https://wa.me/${waNum}" style="background:#1fa855;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">كلّم العميل على واتساب</a></p>
  </div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM || "LandMark Leads <leads@leads.mohabdo.com>",
        to,
        subject: `ليد جديد – ${data.project || "LandMark"} – ${data.name}`,
        html,
      }),
    });
    if (!r.ok) {
      console.error("Resend error", r.status, await r.text());
      return res.status(502).json({ ok: false, error: "send_failed" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ ok: false, error: "send_failed" });
  }
};
