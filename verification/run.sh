#!/usr/bin/env bash
# Runs every check in verification/. See .agents/skills/verify-saved-tools/SKILL.md.
#
# Exit 0 means the code is where the skill says it is: every property that
# should hold holds, and each model mutant is caught. Anything else exits 1
# and says which check moved.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SPEC_DIR="$ROOT/verification/saved-tools"
TOOLS="${TB_FV_TOOLS:-$HOME/.cache/tb-fv}"

TLA_VERSION="1.7.4"
TLA_SHA256="936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88"
TLA_URL="https://github.com/tlaplus/tlaplus/releases/download/v${TLA_VERSION}/tla2tools.jar"
JRE_SHA256="18f44fab9065217f3ba61d0eef8a7b5f3c3713aa7293001b0d4ac10ede3850f0"
JRE_URL="https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.13.1%2B2/OpenJDK21U-jre_x64_linux_hotspot_21.0.13.1_2.tar.gz"

JAR="$TOOLS/dl/tla2tools-${TLA_VERSION}.jar"
mkdir -p "$TOOLS/dl"

fetch() { # url dest sha256
  if [ -f "$2" ] && echo "$3  $2" | sha256sum -c --status; then return 0; fi
  echo "fetching $(basename "$2")"
  curl -fsSL -o "$2.part" "$1" || return 1
  echo "$3  $2.part" | sha256sum -c --status || { echo "checksum mismatch for $1" >&2; rm -f "$2.part"; return 1; }
  mv "$2.part" "$2"
}

fetch "$TLA_URL" "$JAR" "$TLA_SHA256" || exit 1

if [ -x "$TOOLS/jre/bin/java" ]; then
  JAVA="$TOOLS/jre/bin/java"
elif command -v java >/dev/null 2>&1 && java -version 2>&1 | grep -Eq 'version "(1[1-9]|[2-9][0-9])'; then
  JAVA="$(command -v java)"
elif [ "$(uname -sm)" = "Linux x86_64" ]; then
  fetch "$JRE_URL" "$TOOLS/dl/jre21.tar.gz" "$JRE_SHA256" || exit 1
  mkdir -p "$TOOLS/jre" && tar -xzf "$TOOLS/dl/jre21.tar.gz" -C "$TOOLS/jre" --strip-components=1
  JAVA="$TOOLS/jre/bin/java"
else
  echo "Install Java 11 or newer (TLC needs it), then rerun." >&2
  exit 1
fi

OUT="$(mktemp -d "${TMPDIR:-/tmp}/tb-fv.XXXXXX")"
FAILED=0
pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1"; FAILED=1; }

# tlc <name> <spec-file> <cfg>: runs TLC in its own copy so traces and
# state files never land in the repo. Leaves the log at $OUT/<name>.out.
tlc() {
  local work="$OUT/$1"
  mkdir -p "$work"
  cp "$2" "$work/SavedTools.tla"
  cp "$SPEC_DIR/$3" "$work/$3"
  (cd "$work" && "$JAVA" -XX:+UseParallelGC -cp "$JAR" tlc2.TLC -workers auto \
     -metadir "$work/states" -config "$3" SavedTools.tla) > "$OUT/$1.out" 2>&1
  echo $?
}

# expect_pass <name> <cfg>
expect_pass() {
  local code; code="$(tlc "$1" "$SPEC_DIR/SavedTools.tla" "$2")"
  if [ "$code" = 0 ] && grep -q "No error has been found" "$OUT/$1.out"; then
    pass "$1: TypeOK CapHolds NoDuplicates SavedChangesPersist ViewMatchesServer hold ($(grep -o '[0-9,]* distinct states found' "$OUT/$1.out" | tail -1))"
  else
    fail "$1: TLC exit $code, see $OUT/$1.out"
  fi
}

# expect_violation <name> <spec-file> <cfg> <invariant>
expect_violation() {
  local code; code="$(tlc "$1" "$2" "$3")"
  if [ "$code" = 12 ] && grep -q "Invariant $4 is violated" "$OUT/$1.out"; then
    pass "$1 (violates $4 in $(grep -c '^State [0-9]*:' "$OUT/$1.out") states, trace: $OUT/$1.out)"
  else
    fail "$1: expected $4 to be violated, TLC exit $code, see $OUT/$1.out"
  fi
}

# mutant <name> <sed expression> <invariant>: a broken copy of the model
# must fail holds.cfg on that invariant, or the property cannot fail.
mutant() {
  local spec="$OUT/$1.tla"
  sed "$2" "$SPEC_DIR/SavedTools.tla" > "$spec"
  if cmp -s "$spec" "$SPEC_DIR/SavedTools.tla"; then fail "$1: sed matched nothing, update the mutant"; return; fi
  expect_violation "$1" "$spec" holds.cfg "$3"
}

echo "== TLA+ model: verification/saved-tools/SavedTools.tla (TLC $TLA_VERSION)"
expect_pass holds holds.cfg
mutant mutant-no-cap 's/Len(cur) >= Limit/Len(cur) > Limit/' CapHolds
mutant mutant-no-dedupe 's/ELSE IF InSeq(s, cur) THEN \[ok/ELSE IF FALSE THEN [ok/' NoDuplicates
# Drop the per-user lock (the old read-modify-write). SavedChangesPersist must fail.
mutant mutant-lost-update 's/req\[o\]\.pc \/= "read"/TRUE/' SavedChangesPersist
# Restore a reply by overwriting the buttons from that reply alone (the old Deliver).
mutant mutant-stale-view 's#IF settling THEN IF bestV > 0 THEN bestS ELSE confirmed ELSE view#IF req[r].result.ok THEN req[r].result.slugs ELSE req[r].previous#' ViewMatchesServer

echo "== Real code: verification/**/*.verify.ts (vitest)"
if (cd "$ROOT" && pnpm exec vitest run --config verification/vitest.config.mts) > "$OUT/vitest.out" 2>&1; then
  pass "applySavedChange = Apply, overlapping saves both persist, safeNextPath stays on origin"
else
  fail "vitest, see $OUT/vitest.out"
  grep -E "FAIL|✗|×|Error|off-origin|AssertionError" "$OUT/vitest.out" | head -20
fi

echo "logs: $OUT"
if [ "$FAILED" = 0 ]; then echo "OK: matches the skill's recorded state"; else echo "CHANGED: read the FAIL lines above"; fi
exit "$FAILED"
