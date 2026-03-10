export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(400).json({ error: "POST required" });

  const { reservePercent, chargeMode, exportEnabled } = req.body;

  try {
    // Placeholder for real Solix cloud command
    // Currently just logs the intended values
    console.log("Battery Control Command:", reservePercent, chargeMode, exportEnabled);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update battery" });
  }
}
