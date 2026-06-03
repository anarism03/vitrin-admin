const API_URL = process.env.ADMIN_API_URL || "http://161.97.154.119/intern-api/api";

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }

  return value;
}

function getAdminCredentials() {
  return {
    email: getRequiredEnv("ADMIN_EMAIL"),
    password: getRequiredEnv("ADMIN_PASSWORD"),
  };
}

module.exports = {
  API_URL,
  getAdminCredentials,
};

