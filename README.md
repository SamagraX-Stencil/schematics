# Custom Schematics

Custom schematics can streamline the process of generating code and adding features to your Nest.js project. Follow these steps to use your custom schematics:

1. **Initialize Your Nest Project**: Make sure you have a Nest.js project set up.

2. **Install the Custom Schematics Package**: In your project's root directory, install the custom schematics package by running the following command:

   ```sh
   npm install @samagra-x/schematics
   ```

3. Modify the contents of your `nest-cli.json` file to the following

   ```json
   {
     "$schema": "https://json.schemastore.org/nest-cli",
     "collection": "@samagra-x/schematics",
     "sourceRoot": "src",
     "compilerOptions": {
       "deleteOutDir": true
     }
   }
   ```

Now, You can use commands like nest generate like normal, along with arguments like `nest g <CUSTOME_STENCIL_SERVICE_NAME>` to generate custom service.
Currently supported services are:
- Prisma
- Monitoring Using Prometheus and Grafana
- Temporal
- Logging
- File Upload
