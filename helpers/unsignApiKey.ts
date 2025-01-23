// "use server";
// import crypto from "crypto";

// // Function to sign an API key
// export function signApiKey(apiKey) {
//   const SECRET_KEY = process.env.API_sECRET; // Store this securely in your .env.local file
//   if (!SECRET_KEY) {
//     throw new Error("API SECRET not founds");
//   }
//   const hmac = crypto.createHmac("sha256", SECRET_KEY);
//   hmac.update(apiKey);
//   return hmac.digest("hex"); // Signature
// }

// // Function to verify (unsign) the API key
// export function unsignApiKey(apiKey, receivedSignature) {
//   const expectedSignature = signApiKey(apiKey);
//   return expectedSignature === receivedSignature; // Boolean
// }
