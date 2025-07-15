# Tree CLI Tool

[![CI](https://github.com/oyal/tree-cli-tool/workflows/CI/badge.svg)](https://github.com/oyal/tree-cli-tool/actions)
[![npm version](https://badge.fury.io/js/tree-cli-tool.svg)](https://badge.fury.io/js/tree-cli-tool)
[![codecov](https://codecov.io/gh/oyal/tree-cli-tool/branch/main/graph/badge.svg)](https://codecov.io/gh/oyal/tree-cli-tool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个功能强大的命令行工具，用于显示目录树状结构，支持多种配置选项和输出格式。

## 安装

```bash
npm install -g tree-cli-tool
```

## 基本用法

```bash
# 显示当前目录的树状结构
tree-cli

# 显示指定目录的树状结构
tree-cli /path/to/directory

# 限制遍历深度
tree-cli -d 3

# 显示文件大小
tree-cli -s

# 输出为 JSON 格式
tree-cli -f json

# 排除特定文件/目录
tree-cli -e "node_modules" "*.log" ".git"
```

## 命令选项

### 基本选项

- `[path]` - 目标目录路径（默认：当前目录）
- `-d, --max-depth <number>` - 最大遍历深度，-1 表示无限制（默认：-1）
- `-f, --format <type>` - 输出格式：text|json|markdown（默认：text）

### 过滤选项

- `-e, --exclude <patterns...>` - 排除模式（支持 glob 风格）
- `--include-types <types...>` - 只包含指定文件类型（扩展名）
- `--exclude-types <types...>` - 排除指定文件类型（扩展名）
- `-i, --ignore-pattern <regex>` - 正则表达式忽略模式

### 显示选项

- `-a, --show-hidden` - 显示隐藏文件和目录
- `-s, --show-size` - 显示文件大小
- `--show-date` - 显示修改时间
- `-D, --dirs-only` - 只显示目录
- `--no-color` - 禁用彩色输出

### 输出选项

- `-o, --output <file>` - 输出到文件而不是标准输出

## 预设命令

### quick 命令

快速查看目录结构，自动排除常见的构建目录：

```bash
tree-cli quick [path] [-d depth]
```

自动排除：`node_modules`, `.git`, `dist`, `build`, `.next`, `.nuxt`

### dev 命令

开发者友好的视图，排除更多构建和缓存目录：

```bash
tree-cli dev [path] [-d depth]
```

自动排除：`node_modules`, `.git`, `dist`, `build`, `.next`, `.nuxt`, `coverage`, `.nyc_output`, `.cache`, `tmp`, `temp`, `*.log`, `.DS_Store`, `Thumbs.db`

## 使用示例

### 1. 基本目录树

```bash
tree-cli
```

### 2. 限制深度并显示文件大小

```bash
tree-cli -d 2 -s
```

### 3. 只显示 JavaScript 和 TypeScript 文件

```bash
tree-cli --include-types js ts jsx tsx
```

### 4. 排除特定目录和文件类型

```bash
tree-cli -e "node_modules" "dist" --exclude-types log tmp
```

### 5. 输出为 JSON 格式

```bash
tree-cli -f json -o tree.json
```

### 6. 使用正则表达式排除文件

```bash
tree-cli -i "test.*\\.js$"
```

### 7. 开发者模式查看项目结构

```bash
tree-cli dev -d 3
```

## 输出格式

### Text 格式（默认）

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

### JSON 格式

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

### Markdown 格式

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

## 作为 Node.js 模块使用

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

## 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/oyal/tree-cli-tool.git
cd tree-cli-tool

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建项目
npm run build

# 运行测试
npm test

# 代码格式化
npm run format

# 检查代码格式
npm run format:check
```

### 代码质量保证

项目配置了以下代码质量工具：

- **Prettier**: 代码格式化
- **GitHub Actions**: 自动化 CI/CD 流程

**代码质量检查** 在以下时机自动运行：

1. GitHub Actions CI 流程中
2. 发布前自动检查（prepublishOnly）

### 发布流程

本项目使用 GitHub Actions 自动化发布流程：

1. **自动发布** (推荐)：
   - 进入 GitHub Actions 页面
   - 选择 "Publish" 工作流
   - 选择版本类型 (patch/minor/major)
   - 点击运行

2. **手动发布**：
   ```bash
   npm version patch  # 或 minor, major
   git push origin main --tags
   ```

### 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT