const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const BACKUP_DIR = path.join(__dirname, '../backups');
const DATE = new Date().toISOString().split('T')[0];

// Creează directorul de backup dacă nu există
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

// Lista de fișiere și directoare importante
const importantPaths = [
    'app',
    'components',
    'styles',
    'public',
    'prisma',
    'package.json',
    'package-lock.json',
    'tailwind.config.ts',
    'postcss.config.mjs',
    'next.config.js',
    '.env'
];

// Creează un director pentru backup-ul de azi
const todayBackupDir = path.join(BACKUP_DIR, DATE);
if (!fs.existsSync(todayBackupDir)) {
    fs.mkdirSync(todayBackupDir);
}

// Copiază fișierele importante
importantPaths.forEach(item => {
    const sourcePath = path.join(__dirname, '..', item);
    const targetPath = path.join(todayBackupDir, item);
    
    if (fs.existsSync(sourcePath)) {
        if (fs.lstatSync(sourcePath).isDirectory()) {
            // Copiază directorul
            exec(`xcopy "${sourcePath}" "${targetPath}" /E /I /H`, (error) => {
                if (error) console.error(`Eroare la copierea ${item}:`, error);
                else console.log(`✓ ${item} copiat cu succes`);
            });
        } else {
            // Copiază fișierul
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`✓ ${item} copiat cu succes`);
        }
    }
});

// Backup pentru baza de date (dacă există schema Prisma)
if (fs.existsSync(path.join(__dirname, '../prisma/schema.prisma'))) {
    const dbBackupPath = path.join(todayBackupDir, 'database-backup.sql');
    exec('npx prisma db pull --print > ' + dbBackupPath, (error) => {
        if (error) console.error('Eroare la backup-ul bazei de date:', error);
        else console.log('✓ Backup baza de date creat cu succes');
    });
}

console.log(`\nBackup completat în: ${todayBackupDir}`); 