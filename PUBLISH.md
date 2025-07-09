# 发布指南

## 发布前检查清单

在发布到 npmjs 之前，请确保完成以下检查：

### ✅ 代码质量

- [ ] 所有测试通过：`npm test`
- [ ] 代码格式正确：`npm run format:check`
- [ ] 构建成功：`npm run build`
- [ ] 类型定义生成：检查 `dist/*.d.ts` 文件

### ✅ 包配置

- [ ] 版本号正确：检查 `package.json` 中的 `version`
- [ ] 包内容正确：`npm pack --dry-run`
- [ ] README.md 内容完整
- [ ] CHANGELOG.md 已更新

### ✅ 仓库状态

- [ ] 所有更改已提交
- [ ] 代码已推送到 GitHub
- [ ] CI 构建通过

## 发布步骤

### 方法一：自动发布（推荐）

1. 进入 GitHub Actions 页面
2. 选择 "Publish" 工作流
3. 选择版本类型 (patch/minor/major)
4. 点击运行

### 方法二：手动发布

```bash
# 1. 更新版本
npm version patch  # 或 minor, major

# 2. 推送标签
git push origin main --tags

# 3. 发布到 npm
npm publish
```

## 版本管理

- **patch** (1.0.0 → 1.0.1): 修复 bug
- **minor** (1.0.0 → 1.1.0): 新功能，向后兼容
- **major** (1.0.0 → 2.0.0): 破坏性更改

## 发布后验证

```bash
# 安装发布的包
npm install -g tree-cli-tool@latest

# 测试命令
tree-cli --help
tree-cli --version

# 测试功能
tree-cli -f json -d 2
```
