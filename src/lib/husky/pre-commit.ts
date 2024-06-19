export const preCommit = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Temporary files to collect errors
prettier_errors=$(mktemp)
eslint_errors=$(mktemp)

# Run Prettier to check and fix code formatting
npm run format 2>&1 | tee "$prettier_errors"
prettier_exit_code=$?

# Run ESLint to check and fix code issues
npm run lint 2>&1 | tee "$eslint_errors"
eslint_exit_code=$?

# Check if there are any errors in the temporary files
prettier_errors_content=$(cat "$prettier_errors")
eslint_errors_content=$(cat "$eslint_errors")

# Remove the temporary files
rm "$prettier_errors" "$eslint_errors"

# If there are any errors, display them and exit with non-zero status
if [ $prettier_exit_code -ne 0 ] || [ $eslint_exit_code -ne 0 ]; then
  if [ -n "$prettier_errors_content" ]; then
    echo "Prettier errors:"
    echo "$prettier_errors_content"
  fi
  if [ -n "$eslint_errors_content" ]; then
    echo "ESLint errors:"
    echo "$eslint_errors_content"
  fi
  exit 1
fi

# Run Tests
npm test
test_exit_code=$?

# If tests fail, exit with non-zero status
if [ $test_exit_code -ne 0 ]; then
  echo "Tests failed"
  exit 1
fi

# If tests pass, build the application
npm run build
build_exit_code=$?

# If build fails, exit with non-zero status
if [ $build_exit_code -ne 0 ]; then
  echo "Build failed"
  exit 1
fi

# Run docker-compose in detached mode
docker-compose -f docker-compose.yaml --env-file env-example up --build -d
docker_compose_exit_code=$?

# If docker-compose fails, exit with non-zero status
if [ $docker_compose_exit_code -ne 0 ]; then
  echo "docker-compose up failed"
  exit 1
fi

# Wait for a few seconds to allow the application to start
sleep 10

# Send a curl request to check if the application is up
response=$(curl --write-out "%{http_code}" --silent --output /dev/null http://localhost:3000)

# Check if the response code is between 200 and 399
if [ $response -ge 200 ] && [ $response -lt 400 ]; then
  echo "Application is up and running with status code $response"
  docker-compose -f docker-compose.yaml down
  exit 0
else
  echo "Application failed to start, received status code $response"
  docker-compose -f docker-compose.yaml down
  exit 1
fi
`;
