#!/bin/bash

# Script to verify that the package is ready for npm publication

echo "🔍 Verifying package for npm publication..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# 1. Verify that package.json exists
echo "📦 Verifying package.json..."
if [ ! -f package.json ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

# 2. Verify critical fields
echo "  Verifying critical fields..."

# Author
author=$(node -p "require('./package.json').author")
if [ "$author" == "" ] || [ "$author" == "undefined" ]; then
    echo -e "${RED}  ❌ 'author' field is empty${NC}"
    ((errors++))
else
    echo -e "${GREEN}  ✓ Author configured${NC}"
fi

# Repository
repo=$(node -p "require('./package.json').repository.url")
if [[ "$repo" == *"USERNAME"* ]]; then
    echo -e "${RED}  ❌ Repository contains placeholder 'USERNAME'${NC}"
    ((errors++))
else
    echo -e "${GREEN}  ✓ Repository configured${NC}"
fi

# Name
name=$(node -p "require('./package.json').name")
echo -e "${GREEN}  ✓ Name: $name${NC}"

# Version
version=$(node -p "require('./package.json').version")
echo -e "${GREEN}  ✓ Version: $version${NC}"

echo ""

# 3. Verify essential files
echo "📄 Verifying essential files..."
if [ ! -f README.md ]; then
    echo -e "${RED}  ❌ README.md not found${NC}"
    ((errors++))
else
    echo -e "${GREEN}  ✓ README.md exists${NC}"
fi

if [ ! -f LICENSE ]; then
    echo -e "${RED}  ❌ LICENSE not found${NC}"
    ((errors++))
else
    echo -e "${GREEN}  ✓ LICENSE exists${NC}"
fi

if [ ! -f .npmignore ]; then
    echo -e "${YELLOW}  ⚠ .npmignore not found${NC}"
    ((warnings++))
else
    echo -e "${GREEN}  ✓ .npmignore exists${NC}"
fi

echo ""

# 4. Verify build
echo "🔨 Verifying build..."
if [ ! -d dist ]; then
    echo -e "${RED}  ❌ dist/ directory doesn't exist - run 'npm run build'${NC}"
    ((errors++))
else
    echo -e "${GREEN}  ✓ dist/ directory exists${NC}"

    if [ ! -f dist/index.js ]; then
        echo -e "${RED}  ❌ dist/index.js doesn't exist${NC}"
        ((errors++))
    else
        echo -e "${GREEN}  ✓ dist/index.js exists${NC}"
    fi

    if [ ! -f dist/index.d.ts ]; then
        echo -e "${RED}  ❌ dist/index.d.ts doesn't exist (type definitions)${NC}"
        ((errors++))
    else
        echo -e "${GREEN}  ✓ dist/index.d.ts exists${NC}"
    fi
fi

echo ""

# 5. Verify tests
echo "🧪 Verifying tests..."
npm test > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}  ❌ Tests fail - run 'npm test' for details${NC}"
    ((errors++))
else
    echo -e "${GREEN}  ✓ Tests pass${NC}"
fi

echo ""

# 6. Simulate packaging
echo "📦 Simulating packaging..."
npm pack --dry-run > /tmp/pack-output.txt 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}  ❌ npm pack failed${NC}"
    cat /tmp/pack-output.txt
    ((errors++))
else
    files_count=$(grep -c "npm notice" /tmp/pack-output.txt)
    echo -e "${GREEN}  ✓ Packaging successful ($files_count files)${NC}"

    # Show estimated size
    size=$(grep "package size:" /tmp/pack-output.txt | awk '{print $3, $4}')
    if [ ! -z "$size" ]; then
        echo -e "${GREEN}    Package size: $size${NC}"
    fi

    unpacked=$(grep "unpacked size:" /tmp/pack-output.txt | awk '{print $3, $4}')
    if [ ! -z "$unpacked" ]; then
        echo -e "${GREEN}    Unpacked size: $unpacked${NC}"
    fi
fi

echo ""

# 7. Verify that the name is available on npm
echo "🔎 Verifying name availability..."
npm view "$name" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${YELLOW}  ⚠ The name '$name' already exists on npm${NC}"
    echo -e "${YELLOW}    Consider using a scoped package: @yourusername/$name${NC}"
    ((warnings++))
else
    echo -e "${GREEN}  ✓ Name '$name' available${NC}"
fi

echo ""

# Summary
echo "═══════════════════════════════════════"
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ Everything ready to publish!${NC}"
    echo ""
    echo "Next step:"
    echo "  npm login"
    echo "  npm publish --access public"
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ Ready with warnings ($warnings)${NC}"
    echo ""
    echo "You can publish, but review the warnings above"
else
    echo -e "${RED}❌ Not ready to publish ($errors errors, $warnings warnings)${NC}"
    echo ""
    echo "Fix errors before publishing"
    exit 1
fi
echo "═══════════════════════════════════════"
