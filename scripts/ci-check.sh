#!/usr/bin/env bash
# * AgentEnforcer local CI gate for the-beef.info (Astro/TypeScript project).
# * Runs type-checking and linting. Exits non-zero on first failure.

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

PASS=0
FAIL=0
ERRORS=()

run_step() {
  local label="$1"
  shift
  echo ""
  echo "▶  $label"
  if "$@"; then
    echo "✓  $label passed"
    ((PASS++)) || true
  else
    echo "✗  $label FAILED"
    ((FAIL++)) || true
    ERRORS+=("$label")
  fi
}

echo "========================================"
echo "  AgentEnforcer CI  —  the-beef.info"
echo "========================================"

run_step "TypeScript / Astro check"  npx astro check
run_step "ESLint"                    npx eslint .
run_step "Circular dependency check" npm run check:cycles

echo ""
echo "========================================"
echo "  Results: $PASS passed, $FAIL failed"
echo "========================================"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "! Failed steps:"
  for err in "${ERRORS[@]}"; do
    echo "  - $err"
  done
  echo ""
  exit 1
fi

echo ""
echo "All CI checks passed."
echo ""
