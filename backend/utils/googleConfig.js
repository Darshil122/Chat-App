const { OAuth2Client } = require("google-auth-library");

const oauth2client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

module.exports = { oauth2client };
