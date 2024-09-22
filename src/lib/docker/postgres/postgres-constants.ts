export const postgresServiceConfig = `
    image: postgres:latest
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    restart: always
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres" ]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
    - postgres_data:/var/lib/postgresql/data
`;
export const postgresVolumeConfig = "postgres_data";

export const postgresEnvContent = `
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres_db
`;
