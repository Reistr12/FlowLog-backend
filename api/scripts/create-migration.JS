const { execSync } = require('child_process');

const name = process.argv[2];

if (!name) {
  console.error('❌ Informe o nome da migration');
  process.exit(1);
}

const migrationPath = `src/infra/migrations/${name}`;

execSync(
  `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js ` +
    `-d src/infra/data-source.ts migration:create ${migrationPath}`,
  { stdio: 'inherit' }
);
