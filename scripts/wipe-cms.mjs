#!/usr/bin/env node
/**
 * Wipe the legacy CMS data from Firestore.
 *
 * Deletes ONLY the storefront CMS docs so the live site re-renders with
 * the defaults baked into the code. Does NOT touch product / order /
 * customer / category / promo / newsletter / staff docs.
 *
 * Paths removed (recursively):
 *   - cms/config                (the singleton StorefrontConfig)
 *   - cms/publishHistory        (the version-history doc)
 *   - cms/publishHistory/items  (the items subcollection, if any)
 *   - cms/pages                 (the long-form page doc)
 *   - cms/pages/items           (the long-form page subcollection)
 *   - cms/journal               (the journal articles doc)
 *   - cms/journal/items         (the journal articles subcollection)
 *
 * It deliberately does NOT touch:
 *   products, customers, orders, categories, media, bunnies,
 *   promo_codes, newsletter_subscribers, staff, activity, settings
 *
 *   npm run cms:wipe
 *
 * The script prints a confirmation prompt, then a final list of the
 * paths that were deleted.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Look for the service-account key in the usual places. Both the admin
// and commerce apps keep one at the app root; the repo root is also a
// common drop point.
const candidateKeys = [
  process.env.SERVICE_ACCOUNT_KEY,
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  join(__dirname, "..", "serviceAccountKey.json"),
  join(__dirname, "..", "..", "serviceAccountKey.json"),
  join(__dirname, "..", "..", "neria_commerce", "serviceAccountKey.json"),
].filter(Boolean);

let keyPath = null;
for (const p of candidateKeys) {
  if (p && existsSync(p)) {
    keyPath = p;
    break;
  }
}

if (!keyPath) {
  console.error("\n❌ Service account key not found.\n");
  console.error("Looked in:");
  for (const p of candidateKeys) console.error("  • " + p);
  console.error(
    "\nGenerate one in Firebase Console → Project Settings → Service " +
      "Accounts → 'Generate new private key' and save it as " +
      "serviceAccountKey.json anywhere along the repo root.",
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
db.databaseAuthVariableOverride = { admin: true };

// ── Wipe plan ──
const wipePaths = [
  "cms/config",
  "cms/publishHistory",
  "cms/publishHistory/items",
  "cms/pages",
  "cms/pages/items",
  "cms/journal",
  "cms/journal/items",
  "cms/media",
  "cms/media/items",
  "cms/bunnies",
  "cms/bunnies/items",
];

async function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function deleteCollectionDeep(collRef) {
  const snap = await collRef.get();
  if (snap.empty) return 0;
  let n = 0;
  // Recurse into subcollections first so subcollection docs go before their parents.
  for (const doc of snap.docs) {
    for (const subId of await doc.ref.listCollections().then((c) => c.map((x) => x.id))) {
      const sub = doc.ref.collection(subId);
      n += await deleteCollectionDeep(sub);
      await sub.get().then((s) => s.empty || sub.doc().delete().catch(() => {}));
    }
  }
  // Now batch-delete the top-level docs.
  const batchSize = 400;
  let batch = db.batch();
  let pending = 0;
  let totalDeleted = 0;
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    pending += 1;
    if (pending >= batchSize) {
      await batch.commit();
      totalDeleted += pending;
      batch = db.batch();
      pending = 0;
    }
  }
  if (pending > 0) {
    await batch.commit();
    totalDeleted += pending;
  }
  return totalDeleted;
}

async function main() {
  console.log("\n🌸 Neria CMS Wipe\n");
  console.log("This will delete the following paths from project");
  console.log("  " + serviceAccount.project_id + ":\n");
  for (const p of wipePaths) console.log("  • " + p);
  console.log("");

  const answer = await confirm(
    "Type 'wipe' to continue (anything else aborts): ",
  );
  if (answer !== "wipe") {
    console.log("\nAborted.\n");
    process.exit(0);
  }

  console.log("\nWiping…\n");

  const results = [];

  // Walk the plan in REVERSE order so leaf subcollections are deleted
  // before their parents (Firestore will reject deletes with non-empty
  // subcollections otherwise).
  for (const path of [...wipePaths].reverse()) {
    // Document paths (even depth, e.g. "cms/config") are singletons;
    // collection paths (odd depth, e.g. "cms/pages/items") are recursive.
    const parts = path.split("/");
    const depth = parts.length;
    if (depth % 2 === 0) {
      // Singleton doc: `cms/config`, `cms/publishHistory`, `cms/pages`
      const ref = db.doc(parts.join("/"));
      try {
        const snap = await ref.get();
        if (snap.exists) {
          await ref.delete();
          results.push({ path, deleted: 1 });
          console.log("  ✓ deleted " + path);
        } else {
          results.push({ path, deleted: 0, note: "did not exist" });
          console.log("  • skip   " + path + " (not present)");
        }
      } catch (err) {
        results.push({ path, error: String(err) });
        console.log("  ✗ " + path + " — " + err.message);
      }
    } else {
      // Collection: `cms/publishHistory/items`, `cms/pages/items`
      const ref = db.collection(parts.join("/"));
      try {
        const n = await deleteCollectionDeep(ref);
        if (n > 0) {
          results.push({ path, deleted: n });
          console.log("  ✓ deleted " + n + " doc(s) from " + path);
        } else {
          results.push({ path, deleted: 0, note: "empty" });
          console.log("  • skip   " + path + " (empty)");
        }
      } catch (err) {
        results.push({ path, error: String(err) });
        console.log("  ✗ " + path + " — " + err.message);
      }
    }
  }

  console.log("\n──────────────────────────────────────");
  const totalDocs = results.reduce((acc, r) => acc + (r.deleted || 0), 0);
  console.log("Deleted " + totalDocs + " document(s).");
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.log("\n⚠️  Errors:");
    for (const r of errors) console.log("  • " + r.path + ": " + r.error);
  }
  console.log(
    "\nNext: open the live storefront and the admin editor — both will " +
      "now read defaults from code instead of stale Firestore data.\n",
  );
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("\n❌ Wipe failed:");
  console.error(err);
  process.exit(1);
});
