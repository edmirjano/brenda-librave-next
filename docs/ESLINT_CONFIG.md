# Brënda Librave - ESLint Configuration

Comprehensive ESLint setup for optimal performance, SEO, and code quality in our Next.js bookshop platform.

## 📋 Complete ESLint Configuration

### `.eslintrc.json`
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@next/next/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:security/recommended",
    "plugin:unicorn/recommended",
    "prettier"
  ],
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import",
    "security",
    "unicorn",
    "unused-imports",
    "simple-import-sort",
    "@next/next"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  },
  "rules": {
    // ==================== PERFORMANCE RULES ====================
    
    // Prevent performance-killing patterns
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",
    "react/no-array-index-key": "warn",
    "react/no-unstable-nested-components": "error",
    "react/jsx-no-bind": ["error", {
      "allowArrowFunctions": false,
      "allowBind": false,
      "allowFunctions": false
    }],
    
    // Optimize bundle size
    "import/no-duplicates": "error",
    "import/no-unused-modules": ["error", {
      "unusedExports": true
    }],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": ["warn", {
      "vars": "all",
      "varsIgnorePattern": "^_",
      "args": "after-used",
      "argsIgnorePattern": "^_"
    }],
    
    // Prevent memory leaks
    "react/no-direct-mutation-state": "error",
    "react/no-this-in-sfc": "error",
    "react/no-will-update-set-state": "error",
    
    // Optimize re-renders
    "react/jsx-no-constructed-context-values": "error",
    "react/no-object-type-as-prop": "error",
    
    // ==================== SEO RULES ====================
    
    // Meta tags and SEO structure
    "@next/next/no-page-custom-font": "warn",
    "@next/next/no-title-in-document-head": "error",
    "@next/next/no-head-element": "error",
    "@next/next/no-html-link-for-pages": "error",
    
    // Accessibility (crucial for SEO)
    "jsx-a11y/alt-text": ["error", {
      "elements": ["img", "object", "area", "input[type=\"image\"]"],
      "img": ["Image"],
      "object": ["Object"],
      "area": ["Area"],
      "input[type=\"image\"]": ["InputImage"]
    }],
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": ["Link"],
      "specialLink": ["hrefLeft", "hrefRight"],
      "aspects": ["noHref", "invalidHref", "preferButton"]
    }],
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/html-has-lang": "error",
    "jsx-a11y/lang": "error",
    "jsx-a11y/no-redundant-roles": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
    
    // Image optimization for SEO
    "@next/next/no-img-element": "error",
    
    // ==================== SECURITY RULES ====================
    
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "error",
    "security/detect-disable-mustache-escape": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-non-literal-fs-filename": "error",
    "security/detect-non-literal-require": "error",
    "security/detect-possible-timing-attacks": "error",
    "security/detect-pseudoRandomBytes": "error",
    
    // Prevent XSS in React
    "react/no-danger": "warn",
    "react/no-danger-with-children": "error",
    
    // ==================== TYPESCRIPT RULES ====================
    
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports",
      "disallowTypeAnnotations": false
    }],
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // ==================== IMPORT ORGANIZATION ====================
    
    "simple-import-sort/imports": ["error", {
      "groups": [
        // React and Next.js
        ["^react", "^next"],
        // External packages
        ["^@?\\w"],
        // Internal packages
        ["^(@|@/|~/|src/)"],
        // Parent imports
        ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
        // Other relative imports
        ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        // Style imports
        ["^.+\\.s?css$"]
      ]
    }],
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-unresolved": "error",
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    
    // ==================== REACT BEST PRACTICES ====================
    
    "react/prop-types": "off", // Using TypeScript
    "react/react-in-jsx-scope": "off", // Next.js handles this
    "react/display-name": "error",
    "react/no-children-prop": "error",
    "react/no-deprecated": "error",
    "react/no-find-dom-node": "error",
    "react/no-render-return-value": "error",
    "react/no-string-refs": "error",
    "react/no-unescaped-entities": "error",
    "react/require-render-return": "error",
    "react/self-closing-comp": "error",
    "react/jsx-boolean-value": ["error", "never"],
    "react/jsx-curly-brace-presence": ["error", {
      "props": "never",
      "children": "never"
    }],
    "react/jsx-fragments": ["error", "syntax"],
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-pascal-case": "error",
    "react/jsx-uses-react": "off", // Next.js handles this
    "react/jsx-uses-vars": "error",
    
    // ==================== GENERAL CODE QUALITY ====================
    
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-arrow-callback": "error",
    "prefer-template": "error",
    "prefer-destructuring": ["error", {
      "VariableDeclarator": {
        "array": false,
        "object": true
      },
      "AssignmentExpression": {
        "array": true,
        "object": false
      }
    }],
    
    // ==================== UNICORN RULES (Performance & Modern JS) ====================
    
    "unicorn/prevent-abbreviations": "off", // Too strict for our use case
    "unicorn/filename-case": ["error", {
      "cases": {
        "camelCase": true,
        "pascalCase": true,
        "kebabCase": true
      }
    }],
    "unicorn/no-array-for-each": "error",
    "unicorn/no-for-loop": "error",
    "unicorn/prefer-modern-math-apis": "error",
    "unicorn/prefer-node-protocol": "error",
    "unicorn/prefer-optional-catch-binding": "error",
    "unicorn/prefer-string-starts-ends-with": "error",
    "unicorn/prefer-includes": "error",
    "unicorn/prefer-array-some": "error",
    "unicorn/prefer-array-find": "error",
    "unicorn/prefer-array-flat-map": "error",
    "unicorn/prefer-ternary": "error",
    "unicorn/throw-new-error": "error"
  },
  "overrides": [
    // API Routes specific rules
    {
      "files": ["**/api/**/*.ts", "**/api/**/*.js"],
      "rules": {
        "no-console": "off",
        "@next/next/no-server-import-in-page": "off"
      }
    },
    // Configuration files
    {
      "files": ["*.config.js", "*.config.ts"],
      "rules": {
        "import/no-default-export": "off",
        "unicorn/prefer-module": "off"
      }
    },
    // Test files
    {
      "files": ["**/__tests__/**/*", "**/*.test.*", "**/*.spec.*"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "security/detect-object-injection": "off"
      }
    },
    // Prisma schema
    {
      "files": ["prisma/schema.prisma"],
      "rules": {
        "@typescript-eslint/no-unused-vars": "off"
      }
    }
  ]
}
```

## 📦 Required Dependencies

### Development Dependencies to Install
```bash
npm install --save-dev \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import \
  eslint-plugin-security \
  eslint-plugin-unicorn \
  eslint-plugin-unused-imports \
  eslint-plugin-simple-import-sort \
  eslint-config-prettier \
  eslint-import-resolver-typescript
```

## 🎯 Performance-Specific Rules Explained

### React Performance
- **`react-hooks/exhaustive-deps`**: Prevents infinite re-renders and ensures proper dependency arrays
- **`react/jsx-no-bind`**: Prevents inline function creation that causes unnecessary re-renders
- **`react/no-unstable-nested-components`**: Prevents component re-creation on every render
- **`react/jsx-no-constructed-context-values`**: Prevents unnecessary context re-renders

### Bundle Size Optimization
- **`import/no-duplicates`**: Combines duplicate imports to reduce bundle size
- **`unused-imports/no-unused-imports`**: Removes dead code automatically
- **`import/no-unused-modules`**: Identifies completely unused files

### Memory Management
- **`react/no-direct-mutation-state`**: Prevents memory leaks in React components
- **`@typescript-eslint/no-floating-promises`**: Ensures promises are properly handled

## 🔍 SEO-Specific Rules Explained

### Meta Tags & Structure
- **`@next/next/no-title-in-document-head`**: Ensures proper title handling in Next.js
- **`@next/next/no-head-element`**: Enforces use of Next.js Head component
- **`jsx-a11y/html-has-lang`**: Ensures lang attribute for search engines

### Image Optimization
- **`@next/next/no-img-element`**: Enforces Next.js Image component for better SEO and performance
- **`jsx-a11y/alt-text`**: Ensures alt attributes for screen readers and SEO

### Accessibility (SEO Factor)
- **`jsx-a11y/anchor-is-valid`**: Proper link structure for crawlers
- **`jsx-a11y/heading-has-content`**: Ensures headings have content for SEO hierarchy

## 🛡️ Security Rules Explained

### XSS Prevention
- **`react/no-danger`**: Warns about dangerouslySetInnerHTML usage
- **`security/detect-eval-with-expression`**: Prevents eval() usage

### Input Validation
- **`security/detect-object-injection`**: Prevents object injection attacks
- **`security/detect-non-literal-regexp`**: Ensures safe regex patterns

## 📁 VSCode Configuration

### `.vscode/settings.json`
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🔧 Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "lint:performance": "eslint . --ext .ts,.tsx,.js,.jsx --config .eslintrc.performance.json",
    "type-check": "tsc --noEmit",
    "quality": "npm run lint && npm run type-check"
  }
}
```

## 🎭 Pre-commit Hooks

### `.husky/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint:fix
npm run type-check
```

## 📊 Performance Linting Profile

### `.eslintrc.performance.json` (Stricter for Critical Files)
```json
{
  "extends": ["./.eslintrc.json"],
  "rules": {
    "react/jsx-no-bind": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react/no-array-index-key": "error",
    "unicorn/no-array-for-each": "error",
    "prefer-const": "error",
    "no-var": "error"
  },
  "overrides": [
    {
      "files": ["**/components/**/*", "**/pages/**/*", "**/app/**/*"],
      "rules": {
        "complexity": ["error", 10],
        "max-lines-per-function": ["error", 50],
        "max-depth": ["error", 3]
      }
    }
  ]
}
```

## 🚀 Benefits for Brënda Librave

### Performance Benefits
- **Faster page loads** through optimized imports and component patterns
- **Better Core Web Vitals** scores for SEO ranking
- **Reduced bundle size** through dead code elimination
- **Fewer re-renders** in React components

### SEO Benefits
- **Better accessibility** scores improve search rankings
- **Proper meta tag structure** for social media sharing
- **Optimized images** with Next.js Image component
- **Semantic HTML** through accessibility rules

### Developer Experience
- **Consistent code style** across the team
- **Automatic import organization** for better readability
- **Early bug detection** through TypeScript integration
- **Security vulnerability prevention** before deployment

## 🎯 Integration with CI/CD

### GitHub Actions Example
```yaml
name: Code Quality
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
```

This ESLint configuration ensures that Brënda Librave maintains high code quality, optimal performance, and excellent SEO practices throughout development.