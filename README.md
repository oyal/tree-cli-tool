# Tree CLI Tool

[![CI](https://github.com/oyal/tree-cli-tool/workflows/CI/badge.svg)](https://github.com/oyal/tree-cli-tool/actions)
[![npm version](https://badge.fury.io/js/tree-cli-tool.svg)](https://badge.fury.io/js/tree-cli-tool)
[![codecov](https://codecov.io/gh/oyal/tree-cli-tool/branch/main/graph/badge.svg)](https://codecov.io/gh/oyal/tree-cli-tool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful command-line tool to display directory tree structure with various configuration options and output formats.

**[中文文档](README.zh-CN.md)**

## Installation

```bash
npm install -g tree-cli-tool
```

## Basic Usage

```bash
# Display tree structure of current directory
tree-cli

# Display tree structure of specified directory
tree-cli /path/to/directory

# Limit traversal depth
tree-cli -d 3

# Show file sizes
tree-cli -s

# Output as JSON format
tree-cli -f json

# Exclude specific files/directories
tree-cli -e "node_modules" "*.log" ".git"
```

## Command Options

### Basic Options

- `[path]` - Target directory path (default: current directory)
- `-d, --max-depth <number>` - Maximum traversal depth, -1 for unlimited (default: -1)
- `-f, --format <type>` - Output format: text|json|markdown (default: text)

### Filter Options

- `-e, --exclude <patterns...>` - Exclude patterns (supports glob style)
- `--include-types <types...>` - Include only specified file types (extensions)
- `--exclude-types <types...>` - Exclude specified file types (extensions)
- `-i, --ignore-pattern <regex>` - Regular expression ignore pattern

### Display Options

- `-a, --show-hidden` - Show hidden files and directories
- `-s, --show-size` - Show file sizes
- `--show-date` - Show modification times
- `-D, --dirs-only` - Show directories only
- `--no-color` - Disable colored output

### Output Options

- `-o, --output <file>` - Output to file instead of stdout

## Preset Commands

### quick Command

Quick directory structure view, automatically excludes common build directories:

```bash
tree-cli quick [path] [-d depth]
```

Automatically excludes: `node_modules`, `.git`, `dist`, `build`, `.next`, `.nuxt`

### dev Command

Developer-friendly view, excludes more build and cache directories:

```bash
tree-cli dev [path] [-d depth]
```

Automatically excludes: `node_modules`, `.git`, `dist`, `build`, `.next`, `.nuxt`, `coverage`, `.nyc_output`, `.cache`, `tmp`, `temp`, `*.log`, `.DS_Store`, `Thumbs.db`

## Usage Examples

### 1. Basic Directory Tree

```bash
tree-cli
```

### 2. Limit Depth and Show File Sizes

```bash
tree-cli -d 2 -s
```

### 3. Show Only JavaScript and TypeScript Files

```bash
tree-cli --include-types js ts jsx tsx
```

### 4. Exclude Specific Directories and File Types

```bash
tree-cli -e "node_modules" "dist" --exclude-types log tmp
```

### 5. Output as JSON Format

```bash
tree-cli -f json -o tree.json
```

### 6. Use Regular Expression to Exclude Files

```bash
tree-cli -i "test.*\\.js$"
```

### 7. Developer Mode View Project Structure

```bash
tree-cli dev -d 3
```

## Output Formats

### Text Format (Default)

```
project/
├── src/
│   ├── components/
│   │   └── Button.tsx
│   └── index.ts
├── package.json
└── README.md

2 directories, 3 files
```

### JSON Format

```json
{
  "tree": {
    "name": "project",
    "path": "/path/to/project",
    "isDirectory": true,
    "children": [...]
  },
  "stats": {
    "totalFiles": 3,
    "totalDirectories": 2,
    "totalSize": 1024
  }
}
```

### Markdown Format

```markdown
# Directory Tree: project

- **project**/
  - **src**/
    - **components**/
      - Button.tsx
    - index.ts
  - package.json
  - README.md

## Statistics

- **Directories**: 2
- **Files**: 3
```

## Use as Node.js Module

```javascript
import { generateTree } from 'tree-cli-tool';

const result = await generateTree({
  path: './my-project',
  maxDepth: 3,
  format: 'json',
  exclude: ['node_modules', '.git'],
  showSize: true,
});

console.log(result.formatted);
console.log('Stats:', result.stats);
```

## Development

### Local Development

```bash
# Clone repository
git clone https://github.com/oyal/tree-cli-tool.git
cd tree-cli-tool

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build project
npm run build

# Run tests
npm test

# Format code
npm run format

# Check code formatting
npm run format:check
```

### Code Quality Assurance

The project is configured with the following code quality tools:

- **Prettier**: Code formatting
- **GitHub Actions**: Automated CI/CD pipeline

**Code quality checks** run automatically at:

1. GitHub Actions CI pipeline
2. Pre-publish checks (prepublishOnly)

### Publishing Process

This project uses GitHub Actions for automated publishing:

1. **Automated Publishing** (Recommended):
   - Go to GitHub Actions page
   - Select "Publish" workflow
   - Choose version type (patch/minor/major)
   - Click run

2. **Manual Publishing**:
   ```bash
   npm version patch  # or minor, major
   git push origin main --tags
   ```

### Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

MIT