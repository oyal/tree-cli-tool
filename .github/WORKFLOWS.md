# GitHub Actions 工作流说明

本项目包含三个 GitHub Actions 工作流，用于自动化构建、测试和发布流程。

## 工作流概览

### 1. CI (持续集成) - `ci.yml`

**触发条件：**

- 推送到 `main` 或 `develop` 分支
- 对 `main` 分支的 Pull Request

**功能：**

- 在多个 Node.js 版本 (16.x, 18.x, 20.x) 上运行测试
- 构建项目
- 上传测试覆盖率到 Codecov

### 2. Release (标签发布) - `release.yml`

**触发条件：**

- 推送以 `v` 开头的标签 (如 `v1.0.0`)

**功能：**

- 自动构建和测试
- 发布到 npm
- 创建 GitHub Release

### 3. Publish (手动发布) - `publish.yml`

**触发条件：**

- 手动触发 (workflow_dispatch)

**功能：**

- 选择版本类型 (patch/minor/major) 或自定义版本
- 自动更新版本号
- 创建 Git 标签
- 发布到 npm
- 创建 GitHub Release

## 设置步骤

### 1. 配置 npm 访问令牌

1. 登录到 [npmjs.com](https://www.npmjs.com/)
2. 进入 Account Settings > Access Tokens
3. 创建一个新的 Automation 类型的访问令牌
4. 在 GitHub 仓库中：
   - 进入 Settings > Secrets and variables > Actions
   - 添加新的 Repository secret：
     - Name: `NPM_TOKEN`
     - Value: 你的 npm 访问令牌

### 2. 配置 Codecov (可选)

1. 访问 [codecov.io](https://codecov.io/)
2. 使用 GitHub 账号登录
3. 添加你的仓库
4. 获取上传令牌 (通常自动配置)

### 3. 确保分支保护规则

建议为 `main` 分支设置保护规则：

- 要求 Pull Request 审查
- 要求状态检查通过 (CI 工作流)
- 限制推送到分支

## 使用方法

### 自动发布 (推荐)

使用手动触发的 Publish 工作流：

1. 进入 GitHub 仓库的 Actions 页面
2. 选择 "Publish" 工作流
3. 点击 "Run workflow"
4. 选择版本类型：
   - `patch`: 1.0.0 → 1.0.1 (bug 修复)
   - `minor`: 1.0.0 → 1.1.0 (新功能)
   - `major`: 1.0.0 → 2.0.0 (破坏性更改)
   - 或输入自定义版本号
5. 点击 "Run workflow"

### 手动发布

如果你想手动控制发布过程：

1. 本地更新版本：

   ```bash
   npm version patch  # 或 minor, major
   ```

2. 推送标签：

   ```bash
   git push origin main --tags
   ```

3. Release 工作流会自动触发

## 工作流状态

你可以在以下位置查看工作流状态：

- GitHub 仓库的 Actions 页面
- Pull Request 中的状态检查
- README 中的徽章 (如果添加了)

## 添加状态徽章

在你的主 README.md 中添加这些徽章：

```markdown
[![CI](https://github.com/your-username/tree-cli-tool/workflows/CI/badge.svg)](https://github.com/your-username/tree-cli-tool/actions)
[![npm version](https://badge.fury.io/js/tree-cli-tool.svg)](https://badge.fury.io/js/tree-cli-tool)
[![codecov](https://codecov.io/gh/your-username/tree-cli-tool/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/tree-cli-tool)
```

## 故障排除

### 常见问题

1. **npm 发布失败**
   - 检查 NPM_TOKEN 是否正确设置
   - 确保包名在 npm 上可用
   - 检查版本号是否已存在

2. **测试失败**
   - 确保所有测试在本地通过
   - 检查 Node.js 版本兼容性

3. **权限错误**
   - 确保 GITHUB_TOKEN 有足够权限
   - 检查分支保护规则设置

### 调试技巧

- 查看 Actions 页面的详细日志
- 在本地运行相同的命令进行测试
- 检查 package.json 中的脚本配置
