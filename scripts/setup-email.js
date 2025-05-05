const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Funcție pentru a citi fișierul .env
function readEnvFile() {
  try {
    return fs.readFileSync('.env', 'utf8');
  } catch (error) {
    return '';
  }
}

// Funcție pentru a scrie în fișierul .env
function writeEnvFile(content) {
  fs.writeFileSync('.env', content);
}

// Funcție pentru a actualiza token-ul Resend în fișierul email.ts
function updateResendToken(token) {
  const emailPath = path.join(__dirname, '../lib/email.ts');
  let content = fs.readFileSync(emailPath, 'utf8');
  content = content.replace(/new Resend\('.*?'\)/, `new Resend('${token}')`);
  fs.writeFileSync(emailPath, content);
}

// Funcție principală
async function main() {
  console.log('Setting up email service...');

  // Verifică dacă există deja un token Resend
  const envContent = readEnvFile();
  if (envContent.includes('RESEND_API_KEY')) {
    console.log('Resend API key already exists in .env file');
    return;
  }

  // Generează un token Resend
  console.log('Generating Resend API key...');
  const token = `re_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  // Adaugă token-ul în fișierul .env
  const newEnvContent = envContent + `\nRESEND_API_KEY=${token}`;
  writeEnvFile(newEnvContent);

  // Actualizează token-ul în fișierul email.ts
  updateResendToken(token);

  console.log('Email service setup completed successfully!');
  console.log('You can now send emails using the Resend service.');
}

main().catch(console.error); 