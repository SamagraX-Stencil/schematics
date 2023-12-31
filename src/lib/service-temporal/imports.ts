export const import_register = `
    TemporalModule.registerWorker({
      workerOptions: {
        namespace: 'default',
        taskQueue: 'default',
        workflowsPath: require.resolve('./temporal/workflows/example.workflow'),
        activities: {
          activities,
        },
      },
    }),
    TemporalModule.registerClient(),
  `;
