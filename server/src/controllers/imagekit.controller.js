const crypto = require("crypto");

async function getImageKitAuth(req, res) {
  const token = crypto.randomUUID();

  const expire = Math.floor(Date.now() / 1000) + 60 * 10;

  const signature = crypto
    .createHmac("sha1", process.env.IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest("hex");

  return res.status(200).json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}

module.exports = { getImageKitAuth };