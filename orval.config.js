module.exports = {
  fastapi: {
    input: { target: "http://localhost:9002/openapi.json" },
    output: {
      mode: "tags-split",
      target: "src/api/client.ts",
      schemas: "src/api/model",
      client: "react-query",
      mock: true,
      override: {
        mutator: {
          path: "./src/api/custom-instance.ts",
          name: "customInstance",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
};
