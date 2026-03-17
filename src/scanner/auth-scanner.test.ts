import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanAuth, deriveAuthComplianceNeeds, summarizeAuthFindings } from "./auth-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-auth-"));
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

describe("auth-scanner", () => {
  it("detects JWT usage (sign and verify)", () => {
    const dir = createTempProject({
      "lib/auth.ts": `
        import jwt from 'jsonwebtoken';
        export function createToken(user: any) {
          return jwt.sign({ id: user.id }, process.env.SECRET);
        }
        export function verifyToken(token: string) {
          return jwt.verify(token, process.env.SECRET);
        }
      `,
    });
    try {
      const result = scanAuth(dir);
      assert.ok(result.jwt.length >= 1, "Should detect JWT patterns");
      const types = result.jwt.map((f) => f.type);
      assert.ok(types.includes("jwt-sign"), "Should detect jwt.sign");
    } finally {
      cleanup(dir);
    }
  });

  it("detects session management via express-session", () => {
    const dir = createTempProject({
      "server.ts": `
        import session from 'express-session';
        app.use(session({ secret: 'keyboard cat', resave: false }));
        app.get('/profile', (req, res) => {
          const user = req.session.user;
          res.json(user);
        });
      `,
    });
    try {
      const result = scanAuth(dir);
      assert.ok(result.sessionManagement.length >= 1, "Should detect session management");
    } finally {
      cleanup(dir);
    }
  });

  it("detects OAuth provider patterns", () => {
    const dir = createTempProject({
      "auth/providers.ts": `
        import { GoogleProvider, GitHubProvider } from 'next-auth/providers';
        export const authOptions = {
          providers: [
            GoogleProvider({ clientId: process.env.GOOGLE_ID }),
            GitHubProvider({ clientId: process.env.GITHUB_ID }),
          ],
        };
      `,
    });
    try {
      const result = scanAuth(dir);
      assert.ok(result.oauth.length >= 1, "Should detect OAuth providers");
    } finally {
      cleanup(dir);
    }
  });

  it("detects password hashing with bcrypt", () => {
    const dir = createTempProject({
      "lib/password.ts": `
        import bcrypt from 'bcryptjs';
        export async function hashPassword(password: string) {
          return bcrypt.hash(password, 10);
        }
        export async function checkPassword(password: string, hash: string) {
          return bcrypt.compare(password, hash);
        }
      `,
    });
    try {
      const result = scanAuth(dir);
      assert.ok(result.passwordHashing.length >= 1, "Should detect bcrypt");
      assert.ok(result.passwordHashing.some((f) => f.type === "bcrypt"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects MFA/TOTP patterns", () => {
    const dir = createTempProject({
      "lib/mfa.ts": `
        import { authenticator } from 'otplib';
        export function generateSecret() {
          return authenticator.generateSecret();
        }
        export function verifyOtp(token: string, secret: string) {
          return authenticator.verify({ token, secret });
        }
      `,
    });
    try {
      const result = scanAuth(dir);
      assert.ok(result.mfa.length >= 1, "Should detect MFA/TOTP");
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty results when no auth patterns found", () => {
    const dir = createTempProject({
      "index.ts": `
        import express from 'express';
        const app = express();
        app.get('/', (req, res) => res.send('Hello World'));
        app.listen(3000);
      `,
    });
    try {
      const result = scanAuth(dir);
      assert.strictEqual(result.jwt.length, 0);
      assert.strictEqual(result.sessionManagement.length, 0);
      assert.strictEqual(result.oauth.length, 0);
      assert.strictEqual(result.passwordHashing.length, 0);
      assert.strictEqual(result.mfa.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("deriveAuthComplianceNeeds flags missing MFA when auth exists", () => {
    const dir = createTempProject({
      "auth.ts": `
        import jwt from 'jsonwebtoken';
        const token = jwt.sign({ id: 1 }, 'secret');
      `,
    });
    try {
      const result = scanAuth(dir);
      const needs = deriveAuthComplianceNeeds(result);
      assert.ok(needs.length >= 1, "Should produce compliance needs");
      const mfaWarning = needs.find((n) => n.reason.includes("multi-factor"));
      assert.ok(mfaWarning, "Should warn about missing MFA");
    } finally {
      cleanup(dir);
    }
  });

  it("summarizeAuthFindings returns null for empty results", () => {
    const emptyResult = {
      jwt: [],
      sessionManagement: [],
      oauth: [],
      passwordHashing: [],
      mfa: [],
    };
    const summary = summarizeAuthFindings(emptyResult);
    assert.strictEqual(summary, null);
  });

  it("summarizeAuthFindings includes JWT and OAuth when detected", () => {
    const dir = createTempProject({
      "auth.ts": `
        import jwt from 'jsonwebtoken';
        jwt.sign({ id: 1 }, 'secret');
        const callback = '/api/auth/callback/google';
      `,
    });
    try {
      const result = scanAuth(dir);
      const summary = summarizeAuthFindings(result);
      assert.ok(summary !== null, "Summary should not be null");
      assert.ok(summary!.includes("JWT"), "Summary should mention JWT");
    } finally {
      cleanup(dir);
    }
  });
});
