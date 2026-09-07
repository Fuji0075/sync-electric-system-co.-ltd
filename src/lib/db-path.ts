import path from "node:path";

/**
 * Resolve a sqlite "file:" DATABASE_URL to an absolute path relative to the
 * project root (matches how the Prisma CLI resolves it via prisma7.config.ts).
 */
export function resolveSqliteUrl(databaseUrl: string | undefined) {
  const raw = databaseUrl ?? "file:./dev.db";
  const relative = raw.replace(/^file:/, "");
  const absolute = path.isAbsolute(relative)
    ? relative
    : path.join(/* turbopackIgnore: true */ process.cwd(), relative);
  return `file:${absolute}`;
}
