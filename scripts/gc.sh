#!/usr/bin/env bash
# gc.sh — Weekly anti-pattern scan for ReadLight
# Run: bash scripts/gc.sh

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

ERRORS=0

echo "=== ReadLight Garbage Collection ==="
echo ""

# 1. Layer violation: UI importing from AI directly
echo "--- Layer Violations ---"
UI_AI_IMPORTS=$(grep -rn "from.*['\"]@/lib/ai" app/ components/ 2>/dev/null || true)
if [ -n "$UI_AI_IMPORTS" ]; then
  echo -e "${RED}FAIL: UI layer imports from AI layer directly${NC}"
  echo "$UI_AI_IMPORTS"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}PASS: No UI→AI layer violations${NC}"
fi

# 2. Console.log in production code
echo ""
echo "--- Console.log Check ---"
CONSOLE_LOGS=$(grep -rn "console\.log" lib/ app/ components/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "\.test\." || true)
if [ -n "$CONSOLE_LOGS" ]; then
  echo -e "${YELLOW}WARN: console.log found in production code${NC}"
  echo "$CONSOLE_LOGS"
else
  echo -e "${GREEN}PASS: No console.log in production code${NC}"
fi

# 3. Hardcoded secrets
echo ""
echo "--- Secret Scan ---"
SECRETS=$(grep -rn "sk-\|api_key.*=.*['\"]" lib/ app/ components/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "process\.env\|\.example\|\.test\." || true)
if [ -n "$SECRETS" ]; then
  echo -e "${RED}FAIL: Possible hardcoded secrets${NC}"
  echo "$SECRETS"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}PASS: No hardcoded secrets found${NC}"
fi

# 4. Direct mutation patterns
echo ""
echo "--- Mutation Check ---"
MUTATIONS=$(grep -rn "\.push(\|\.splice(\|\.sort()\|\.reverse()" lib/ --include="*.ts" 2>/dev/null || true)
if [ -n "$MUTATIONS" ]; then
  echo -e "${YELLOW}WARN: Possible direct mutations in lib/${NC}"
  echo "$MUTATIONS"
else
  echo -e "${GREEN}PASS: No direct mutations found${NC}"
fi

# 5. Large files (>800 lines)
echo ""
echo "--- File Size Check ---"
LARGE_FILES=$(find app/ lib/ components/ -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read f; do
  lines=$(wc -l < "$f")
  if [ "$lines" -gt 800 ]; then
    echo "$f: $lines lines"
  fi
done || true)
if [ -n "$LARGE_FILES" ]; then
  echo -e "${YELLOW}WARN: Large files found (>800 lines)${NC}"
  echo "$LARGE_FILES"
else
  echo -e "${GREEN}PASS: All files under 800 lines${NC}"
fi

echo ""
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}=== $ERRORS critical issues found ===${NC}"
  exit 1
else
  echo -e "${GREEN}=== All checks passed ===${NC}"
fi
