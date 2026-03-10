
export default async function handler(req, res) {
  const email = process.env.ANKER_EMAIL;
  const password = process.env.ANKER_PASSWORD;

  try {
    // 1️⃣ Login to Anker cloud
    const loginResp = await fetch("https://cloud.anker.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginResp.json();
    const token = loginData.token; // your access token

    // 2️⃣ Get your devices
    const devicesResp = await fetch("https://cloud.anker.com/devices", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const devices = await devicesResp.json();

    // 3️⃣ Find Solarbank 2 and 3
    const solixDevices = devices.filter(d =>
      d.model.includes("Solarbank 2") || d.model.includes("Solarbank 3")
    );

    // 4️⃣ Aggregate data
    let totalSolar = 0;
    let totalBattery = 0;
    let totalHome = 0;

    solixDevices.forEach(d => {
      totalSolar += d.solar_output_w || 0;
      totalBattery += d.battery_percent || 0;
      totalHome += d.home_consumption_w || 0;
    });

    // 5️⃣ Respond
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
