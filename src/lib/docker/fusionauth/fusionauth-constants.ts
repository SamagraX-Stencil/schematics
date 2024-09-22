export const fusionauthServiceConfig = `
    image: fusionauth/fusionauth-app:latest
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: jdbc:postgresql://postgres:5432/fusionauth
      DATABASE_ROOT_USERNAME: \${POSTGRES_USER}
      DATABASE_ROOT_PASSWORD: \${POSTGRES_PASSWORD}
      DATABASE_USERNAME: \${DATABASE_USERNAME}
      DATABASE_PASSWORD: \${DATABASE_PASSWORD}
      FUSIONAUTH_APP_MEMORY: \${FUSIONAUTH_APP_MEMORY}
      FUSIONAUTH_APP_RUNTIME_MODE: \${FUSIONAUTH_APP_RUNTIME_MODE}
      FUSIONAUTH_APP_URL: http://fusionauth:9011
    healthcheck:
      test: curl --silent --fail http://localhost:9011/api/status -o /dev/null -w "%{http_code}"
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    ports:
      - 9011:9011
    volumes:
      - fusionauth_config:/usr/local/fusionauth/config
`;
export const fusionauthVolumeConfig = "fusionauth_config";

export const fusionauthEnvContent = `
DATABASE_USERNAME=fusionauth
DATABASE_PASSWORD=secret
FUSIONAUTH_APP_MEMORY=512M
FUSIONAUTH_APP_RUNTIME_MODE=development
`;
