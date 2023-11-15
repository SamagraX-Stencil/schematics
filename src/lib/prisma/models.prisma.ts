// this file contains the data which is being appended by this schematic

export const modelsPrisma = `model Role {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;
