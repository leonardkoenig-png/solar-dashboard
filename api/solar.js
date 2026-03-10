export default async function handler(req, res) {
  const email = process.env.ANKER_EMAIL;
  const password = process.env.ANKER_PASSWORD;

  try {
    // 1️⃣ Login to EU Solix cloud
    const loginResp = await fetch("https://eu.ankersolix.com/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginResp.json();

    if (!loginData.token) {
      return res.status(401).json({ error: "Login failed" });
    }

    const token = loginData.token;

    // 2️⃣ Get your devices
    const devicesResp = await fetch("https://eu.ankersolix.com/api/v1/devices", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const devicesData = await devicesResp.json();

    // 3️⃣ Filter your Solarbank devices
    const solixDevices = devicesData.filter(d =>
      d.name === "Solarbank 2 E1600 PRO" || d.name === "Solarbank 3 E2700 Pro"
    );

    if (!solixDevices.length) {
      return res.status(404).json({ error: "No Solix devices found" });
    }

    // 4️⃣ Aggregate data
    let totalSolar = 0;
    let totalBattery = 0;
    let totalHome = 0;

    solixDevices.forEach(d => {
      totalSolar += d.solar_output_w || 0;
      totalBattery += d.battery_percent || 0;
      totalHome += d.home_consumption_w || 0;
    });

    res.status(200).json({
      solar: totalSolar,
      battery: Math.round(totalBattery / solixDevices.length),
      home: totalHome
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch solar data" });
  }
}
