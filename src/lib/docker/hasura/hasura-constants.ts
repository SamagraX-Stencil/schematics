export const hasuraServiceConfig = `
    image: hasura/graphql-engine:latest
    ports:
      - '8080:8080'
    depends_on:
      - 'postgres'
    restart: always
    environment:
      HASURA_GRAPHQL_DATABASE_URL: \${HASURA_GRAPHQL_DATABASE_URL}
      HASURA_GRAPHQL_ENABLE_CONSOLE: \${HASURA_GRAPHQL_ENABLE_CONSOLE}
      HASURA_GRAPHQL_ADMIN_SECRET: \${HASURA_GRAPHQL_ADMIN_SECRET}
    volumes:
    - hasura_metadata:/hasura_metadata
`;
export const hasuraVolumeConfig = "hasura_metadata";

export const hasuraEnvContent = `
HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres_db
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_ADMIN_SECRET=myadminsecretkey
`;
