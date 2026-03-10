export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "POST required" });
  }

  const email = process.env.ANKER_EMAIL;
  const password = process.env.ANKER_PASSWORD;
  const { reservePercent, chargeMode, exportEnabled } = req.body;

  try {
    // Login
    const loginResp = await fetch("https://eu.ankersolix.com/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginResp.json();
    const token = loginData.token;

    // Get devices
    const devicesResp = await fetch("https://eu.ankersolix.com/api/v1/devices", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const devices = await devicesResp.json();

    const solixDevices = devices.filter(d =>
      d.name === "Solarbank 2 E1600 PRO" || d.name === "Solarbank 3 E2700 Pro"
    );

    // Send battery control command
    for (const d of solixDevices) {
      await fetch(`https://eu.ankersolix.com/api/v1/device/${d.id}/battery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reservePercent, chargeMode, exportEnabled })
      });
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update battery" });
  }
}
