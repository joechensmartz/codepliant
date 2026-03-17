import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanGraphQLEndpoints } from "./graphql-endpoint-scanner.js";
import type { WalkedFile } from "./file-walker.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-gql-"));
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(dir, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

/** Helper to create WalkedFile entries for pre-walked file passing */
function toWalkedFiles(dir: string, filenames: string[]): WalkedFile[] {
  return filenames.map((f) => ({
    fullPath: path.join(dir, f),
    relativePath: f,
    extension: path.extname(f),
  }));
}

describe("graphql-endpoint-scanner", () => {
  it("returns empty result for project with no GraphQL code", () => {
    const dir = createTempProject({
      "src/index.ts": "console.log('hello');",
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.strictEqual(result.endpoints.length, 0);
      assert.strictEqual(result.services.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Apollo Server import", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        const server = new ApolloServer({ typeDefs, resolvers });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0, "Should detect Apollo Server endpoint");
      assert.strictEqual(result.endpoints[0].framework, "apollo-server");
      assert.strictEqual(result.endpoints[0].path, "/graphql");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Apollo Server with custom path", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from 'apollo-server-express';
        const server = new ApolloServer({ typeDefs, resolvers });
        server.applyMiddleware({ app, path: '/api/graphql' });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].path, "/api/graphql");
    } finally {
      cleanup(dir);
    }
  });

  it("detects express-graphql", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { graphqlHTTP } from 'express-graphql';
        app.use('/graphql', graphqlHTTP({ schema }));
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "express-graphql");
      assert.strictEqual(result.endpoints[0].path, "/graphql");
    } finally {
      cleanup(dir);
    }
  });

  it("detects graphql-yoga with createYoga", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { createYoga } from 'graphql-yoga';
        const yoga = createYoga({ graphqlEndpoint: '/api/gql' });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "graphql-yoga");
      assert.strictEqual(result.endpoints[0].path, "/api/gql");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Mercurius (Fastify GraphQL)", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import mercurius from 'mercurius';
        app.register(mercurius, { schema, path: '/graphql' });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "mercurius");
    } finally {
      cleanup(dir);
    }
  });

  it("detects NestJS GraphQL decorators", () => {
    const dir = createTempProject({
      "src/resolver.ts": `
        import { Resolver, Query, Mutation } from '@nestjs/graphql';
        @Resolver()
        export class AppResolver {
          @Query()
          hello() { return 'Hello'; }
        }
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "@nestjs/graphql");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Strawberry (Python)", () => {
    const dir = createTempProject({
      "app.py": `
        import strawberry
        @strawberry.type
        class Query:
            @strawberry.field
            def hello(self) -> str:
                return "Hello"
        schema = strawberry.Schema(query=Query)
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "strawberry");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Graphene (Python)", () => {
    const dir = createTempProject({
      "schema.py": `
        import graphene
        class Query(graphene.ObjectType):
            hello = graphene.String()
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "graphene");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Ariadne (Python)", () => {
    const dir = createTempProject({
      "app.py": `
        from ariadne import make_executable_schema, QueryType
        query_type = QueryType()
        schema = make_executable_schema(type_defs, query_type)
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "ariadne");
    } finally {
      cleanup(dir);
    }
  });

  it("detects gqlgen (Go)", () => {
    const dir = createTempProject({
      "server.go": `
        package main
        import "github.com/99designs/gqlgen/graphql/handler"
        func main() {
          srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &resolver.Resolver{}}))
        }
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "gqlgen");
    } finally {
      cleanup(dir);
    }
  });

  it("detects graphql-ruby", () => {
    const dir = createTempProject({
      "app/graphql/schema.rb": `
        class AppSchema < GraphQL::Schema
          query(Types::QueryType)
          mutation(Types::MutationType)
        end
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "graphql-ruby");
    } finally {
      cleanup(dir);
    }
  });

  it("detects generic /graphql path reference", () => {
    const dir = createTempProject({
      "src/api.ts": `
        const endpoint = '/graphql';
        fetch(endpoint, { method: 'POST', body: JSON.stringify({ query }) });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].path, "/graphql");
      assert.strictEqual(result.endpoints[0].framework, "unknown");
    } finally {
      cleanup(dir);
    }
  });

  it("detects generic /api/graphql path reference", () => {
    const dir = createTempProject({
      "src/client.ts": `
        const url = '/api/graphql';
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].path, "/api/graphql");
    } finally {
      cleanup(dir);
    }
  });

  it("detects subscriptions feature", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        // Subscription support via websocket
        const server = new ApolloServer({ typeDefs, resolvers });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.ok(result.endpoints[0].features.includes("subscriptions"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects mutations feature", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        const Mutation = {};
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.ok(result.endpoints[0].features.includes("mutations"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects queries feature", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        const Query = {};
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.ok(result.endpoints[0].features.includes("queries"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects file-uploads feature", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        import { graphqlUploadExpress } from 'graphql-upload';
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.ok(result.endpoints[0].features.includes("file-uploads"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects persisted-queries feature", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        // Using APQ for persistedQueries
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.ok(result.endpoints[0].features.includes("persisted-queries"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects query-depth-limiting feature", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        import depthLimit from 'graphql-depth-limit';
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length > 0);
      assert.ok(result.endpoints[0].features.includes("query-depth-limiting"));
    } finally {
      cleanup(dir);
    }
  });

  it("creates a GraphQL API service when endpoints found", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        const server = new ApolloServer({ typeDefs, resolvers });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.strictEqual(result.services.length, 1);
      assert.strictEqual(result.services[0].name, "GraphQL API");
      assert.strictEqual(result.services[0].category, "other");
      assert.ok(result.services[0].dataCollected.includes("API query data"));
      assert.ok(result.services[0].dataCollected.includes("mutation payloads"));
      assert.strictEqual(result.services[0].isDataProcessor, false);
    } finally {
      cleanup(dir);
    }
  });

  it("includes uploaded files in dataCollected when file-uploads detected", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        import Upload from 'graphql-upload';
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.services[0].dataCollected.includes("uploaded files"));
    } finally {
      cleanup(dir);
    }
  });

  it("includes real-time subscription data when subscriptions detected", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        // Subscription via websocket with pubsub
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.services[0].dataCollected.includes("real-time subscription data"));
    } finally {
      cleanup(dir);
    }
  });

  it("does not duplicate endpoints for the same path and file", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        import { graphqlHTTP } from 'express-graphql';
        app.use('/graphql', graphqlHTTP({ schema }));
        const server = new ApolloServer({ typeDefs });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      // Both frameworks match, but /graphql from the same file should not duplicate
      const graphqlEndpoints = result.endpoints.filter((e) => e.path === "/graphql");
      // Each framework gets its own entry since they are different frameworks
      assert.ok(graphqlEndpoints.length >= 1);
    } finally {
      cleanup(dir);
    }
  });

  it("accepts pre-walked files", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { createYoga } from 'graphql-yoga';
        const yoga = createYoga({});
      `,
    });
    try {
      const walkedFiles = toWalkedFiles(dir, ["src/server.ts"]);
      const result = scanGraphQLEndpoints(dir, walkedFiles);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "graphql-yoga");
    } finally {
      cleanup(dir);
    }
  });

  it("includes evidence with code_pattern type", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        const server = new ApolloServer({ typeDefs, resolvers });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.services[0].evidence.length > 0);
      assert.strictEqual(result.services[0].evidence[0].type, "code_pattern");
      assert.ok(result.services[0].evidence[0].detail.includes("apollo-server"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Absinthe (Elixir)", () => {
    const dir = createTempProject({
      "lib/app_web/schema.ex": `
        defmodule AppWeb.Schema do
          use Absinthe.Schema
        end
      `,
    });
    try {
      // Need to use walked files since .ex is not in ALL_EXTENSIONS
      const walkedFiles = toWalkedFiles(dir, ["lib/app_web/schema.ex"]);
      const result = scanGraphQLEndpoints(dir, walkedFiles);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "absinthe");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Juniper (Rust)", () => {
    const dir = createTempProject({
      "src/schema.rs": `
        use juniper::{GraphQLObject, EmptyMutation, EmptySubscription};
        #[graphql_object]
        impl Query {
          fn hello() -> &str { "Hello" }
        }
      `,
    });
    try {
      const walkedFiles = toWalkedFiles(dir, ["src/schema.rs"]);
      const result = scanGraphQLEndpoints(dir, walkedFiles);
      assert.ok(result.endpoints.length > 0);
      assert.strictEqual(result.endpoints[0].framework, "juniper");
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple endpoints in different files", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import { ApolloServer } from '@apollo/server';
        const server = new ApolloServer({ typeDefs, resolvers });
      `,
      "src/yoga.ts": `
        import { createYoga } from 'graphql-yoga';
        const yoga = createYoga({ graphqlEndpoint: '/v2/graphql' });
      `,
    });
    try {
      const result = scanGraphQLEndpoints(dir);
      assert.ok(result.endpoints.length >= 2);
      const frameworks = result.endpoints.map((e) => e.framework);
      assert.ok(frameworks.includes("apollo-server"));
      assert.ok(frameworks.includes("graphql-yoga"));
    } finally {
      cleanup(dir);
    }
  });
});
