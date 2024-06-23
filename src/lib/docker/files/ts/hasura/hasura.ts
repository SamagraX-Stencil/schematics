export const hasura = `
  hasura:
    image: hasura/graphql-engine:v2.0.0
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@postgres:5432/\${POSTGRES_DB}
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true" # remove or set to "false" in production
      HASURA_GRAPHQL_ADMIN_SECRET: \${HASURA_GRAPHQL_ADMIN_SECRET}
`;
