# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript CLI tool that generates directory tree structures with various output formats (text, JSON, markdown). The tool is built as a Node.js package using commander.js for CLI parsing and includes formatting capabilities with colored output.

## Commands

### Development Commands

- `npm run dev` - Run CLI tool in development mode with ts-node
- `npm run build` - Compile TypeScript to JavaScript (outputs to dist/)
- `npm run test` - Run Jest tests with coverage
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting (also used as lint)
- `npm run clean` - Remove dist/ directory

### CLI Usage (After Build)

- `tree-cli [path]` - Basic tree generation
- `tree-cli quick [path]` - Quick view excluding common build dirs
- `tree-cli dev [path]` - Development view excluding more directories

## Architecture

### Core Components

1. **src/cli.ts** - CLI entry point using commander.js, handles argument parsing and command routing
2. **src/index.ts** - Main API export, provides `generateTree()` function for programmatic use
3. **src/tree-builder.ts** - Core tree building logic, handles file system traversal and filtering
4. **src/formatters.ts** - Output formatters (TextFormatter, JsonFormatter, MarkdownFormatter)
5. **src/types.ts** - TypeScript type definitions

### Key Design Patterns

- **Factory Pattern**: `createFormatter()` function creates appropriate formatter based on options
- **Builder Pattern**: `TreeBuilder` class constructs file tree with various filtering options
- **Strategy Pattern**: Different formatters implement common interface for output generation

### File Structure

- Source code in `src/`
- Tests in `src/__tests__/`
- Built output in `dist/` (created by TypeScript compiler)
- Coverage reports in `coverage/`

## Testing

Uses Jest with TypeScript support via ts-jest. Test files use `.test.ts` extension and are located in `src/__tests__/`.

## Publishing

The package uses npm scripts for publishing workflow:

- `prepublishOnly` runs clean, build, and test before publishing
- Package exports both CLI binary (`dist/cli.js`) and library (`dist/index.js`)
