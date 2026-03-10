export default async function handler(req, res) {
  const email = process.env.ANKER_EMAIL;
  const password = process.env.ANKER_PASSWORD;

  try {
    // Placeholder for actual Solix cloud login
    // In practice, you need the Anker token fetched from your account
    // This is a simplified example using dummy data for now
    // Once you get your API token, replace the dummy data fetch below

    const devices = [
      { name: "Solarbank 2 E1600 PRO", solar: 820, battery: 70, home: 500 },
      { name: "Solarbank 3 E2700 Pro", solar: 950, battery: 65, home: 600 }
    ];

    // Aggregate totals
    let totalSolar = 0;
    let totalBattery = 0;
    let totalHome = 0;

    devices.forEach(d => {
      totalSolar += d.solar;
      totalBattery += d.battery;
      totalHome += d.home;
    });

    res.status(200).json({
      solar: totalSolar,
      battery: Math.round(totalBattery / devices.length),
      home: totalHome
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch solar data" });
  }
}
