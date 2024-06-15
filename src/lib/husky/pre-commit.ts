export const preCommit = `#!/usr/bin/env sh
. "\$(dirname -- "\$0")/_/husky.sh"

# Run Prettier to check and fix code formatting
npm run prettier 

# Run ESLint to check and fix code issues
npm run lint 

# Stage changes made by Prettier and ESLint
git add .

docker compose -f docker-compose.ci.yaml --env-file env-example -p ci up --build --exit-code-from api
# npm test
# npm test:e2e -- --runInBank --passWithNoTests`;
