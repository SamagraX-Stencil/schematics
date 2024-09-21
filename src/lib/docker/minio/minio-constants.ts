export const minioServiceConfig = `
    image: minio/minio:latest
    container_name: minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: \${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: \${MINIO_ROOT_PASSWORD}
    command: server /data --console-address ":9001"
    volumes:
    - minio_data:/data
`;

export const minioVolumeConfig = "minio_data";

export const minioEnvContent = `
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
`;
