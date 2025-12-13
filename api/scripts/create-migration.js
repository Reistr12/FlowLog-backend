#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Uso: node scripts/migration-generate.js NomeDaMigration');
  console.error('');
  console.error('Exemplo:');
  console.error('  node scripts/migration-generate.js CreateInitialTables');
  process.exit(1);
}

// Garante que estamos na pasta api
const apiDir = path.resolve(__dirname, '..');
process.chdir(apiDir);

// Garante que a pasta existe
const migrationsDir = path.join(apiDir, 'src', 'infra', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Caminho relativo para o TypeORM (DEVE ser relativo à pasta api)
const relativePath = `src/infra/migrations/${migrationName}`;

try {
  // Executa o comando na pasta api
  execSync(
    `ts-node ./node_modules/typeorm/cli.js migration:generate -d data-source.ts "${relativePath}"`,
    { 
      stdio: 'inherit',
      cwd: apiDir,
      env: { ...process.env }
    }
  );
  
  // Verifica se foi criada na pasta correta ou se foi criada na raiz da api
  const filesInMigrations = fs.readdirSync(migrationsDir);
  const filesInApi = fs.readdirSync(apiDir).filter(f => f.endsWith('.ts') && f.includes(migrationName));
  
  if (filesInApi.length > 0) {
    // Migration foi criada na pasta errada (raiz da api)
    console.log(`\n⚠️  Migration criada na pasta errada. Movendo para pasta correta...`);
    filesInApi.forEach(file => {
      const sourcePath = path.join(apiDir, file);
      const destPath = path.join(migrationsDir, file);
      fs.renameSync(sourcePath, destPath);
      console.log(`✅ Movido: ${file} → src/infra/migrations/${file}`);
    });
  }
  
  const createdFile = filesInMigrations.find(f => f.includes(migrationName));
  if (createdFile) {
    console.log(`\n✅ Migration criada com sucesso em: src/infra/migrations/${createdFile}`);
  } else {
    console.error(`\n❌ ERRO: Migration não foi encontrada`);
  }
} catch (error) {
  console.error('Erro ao gerar migration:', error.message);
  process.exit(1);
}

