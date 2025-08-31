// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

// /** Convert +91XXXXXXXXXX / 0987… to 91XXXXXXXXXX for MSG91 Flow */
// function to91(msisdn: string) {
//   const digits = (msisdn || "").replace(/\D/g, "");
//   return digits.startsWith("91") ? digits : `91${digits}`;
// }

// export async function POST(req: Request) {
//   try {
//     // Ensure JSON
//     const contentType = req.headers.get("content-type") || "";
//     if (!contentType.includes("application/json")) {
//       return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
//     }

//     const { to, text, vars } = await req.json();
//     if (!to || !text) {
//       return NextResponse.json({ error: "Missing 'to' or 'text'" }, { status: 400 });
//     }

//     const { MSG91_AUTHKEY, MSG91_FLOW_ID, MSG91_SENDER } = process.env as Record<string, string | undefined>;
//     if (!MSG91_AUTHKEY || !MSG91_FLOW_ID || !MSG91_SENDER) {
//       return NextResponse.json(
//         { error: "MSG91 not configured (set MSG91_AUTHKEY, MSG91_FLOW_ID, MSG91_SENDER)" },
//         { status: 500 }
//       );
//     }

//     // Build payload for MSG91 Flow API
//     const recipient: Record<string, any> = {
//       mobiles: to91(to), // "91XXXXXXXXXX"
//       ...(vars ?? {}),
//     };

//     // Include this only if your Flow has a {{message}} variable
//     recipient.message = text;

//     const payload = {
//       flow_id: MSG91_FLOW_ID,
//       sender: MSG91_SENDER,
//       recipients: [recipient],
//     };

//     const res = await fetch("https://api.msg91.com/api/v5/flow/", {
//       method: "POST",
//       headers: {
//         authkey: MSG91_AUTHKEY,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//       cache: "no-store",
//     });

//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) {
//       return NextResponse.json({ error: "MSG91 send failed", details: data }, { status: 500 });
//     }

//     return NextResponse.json({ ok: true, details: data });
//   } catch (e: any) {
//     return NextResponse.json({ error: e?.message || "SMS failed" }, { status: 500 });
//   }
// }
