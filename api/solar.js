export default async function handler(req, res) {

  const email = process.env.ANKER_EMAIL
  const password = process.env.ANKER_PASSWORD

  // Fake example API — this will be replaced with real Solix connection
  const data = {
    solar: Math.floor(Math.random()*1000),   // W
    battery: Math.floor(Math.random()*100),  // %
    home: Math.floor(Math.random()*800)      // W
  }

  res.status(200).json(data)
}
