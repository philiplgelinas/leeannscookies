const crypto = require("crypto");
const readline = require("readline");

const ITERATIONS = 310000;
const KEY_LENGTH = 64;
const DIGEST = "sha256";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function run() {
  const password = await question("Enter admin password: ");
  const confirmPassword = await question("Confirm admin password: ");

  rl.close();

  if (!password) {
    console.error("Password cannot be empty.");
    process.exit(1);
  }

  if (password !== confirmPassword) {
    console.error("Passwords do not match.");
    process.exit(1);
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  console.log("");
  console.log("Copy this value into Netlify as ADMIN_PASSWORD_HASH:");
  console.log("");
  console.log(`pbkdf2_sha256$${ITERATIONS}$${salt}$${hash}`);
}

run();
