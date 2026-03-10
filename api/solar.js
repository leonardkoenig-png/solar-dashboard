export default async function handler(req, res) {
  try {
    // Simulated data for testing
    const data = {
      solar: 820,     // Solar output in Watts
      battery: 72,    // Battery %
      home: 540       // Home consumption Watts
    };

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch solar data" });
  }
}
