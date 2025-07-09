import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { TreeOptions, FileNode, TreeStats } from './types';

export class TreeBuilder {
  private options: TreeOptions;
  private stats: TreeStats = {
    totalFiles: 0,
    totalDirectories: 0,
    totalSize: 0,
  };

  constructor(options: TreeOptions) {
    this.options = options;
  }

  public async buildTree(): Promise<{ tree: FileNode; stats: TreeStats }> {
    this.resetStats();
    const tree = await this.buildNode(this.options.path, 0);
    return { tree, stats: this.stats };
  }

  private resetStats(): void {
    this.stats = {
      totalFiles: 0,
      totalDirectories: 0,
      totalSize: 0,
    };
  }

  private async buildNode(filePath: string, depth: number): Promise<FileNode> {
    const stat = await fs.promises.stat(filePath);
    const name = path.basename(filePath);

    const node: FileNode = {
      name,
      path: filePath,
      isDirectory: stat.isDirectory(),
      depth,
      size: this.options.showSize ? stat.size : undefined,
      modifiedTime: this.options.showDate ? stat.mtime : undefined,
    };

    if (stat.isDirectory()) {
      this.stats.totalDirectories++;

      // 检查是否超过最大深度（depth从0开始，maxDepth表示要显示的层数）
      // 如果当前深度已经达到maxDepth，则不再递归子目录
      if (this.options.maxDepth !== -1 && depth >= this.options.maxDepth) {
        return node;
      }

      try {
        const entries = await fs.promises.readdir(filePath);
        const children: FileNode[] = [];

        for (const entry of entries) {
          const entryPath = path.join(filePath, entry);

          // 跳过隐藏文件（如果不显示隐藏文件）
          if (!this.options.showHidden && entry.startsWith('.')) {
            continue;
          }

          // 检查排除模式
          if (this.shouldExclude(entry, entryPath)) {
            continue;
          }

          try {
            const entryStat = await fs.promises.stat(entryPath);

            // 如果只显示目录，跳过文件
            if (this.options.dirsOnly && !entryStat.isDirectory()) {
              continue;
            }

            // 检查文件类型过滤
            if (!entryStat.isDirectory() && !this.shouldIncludeFile(entry)) {
              continue;
            }

            const childNode = await this.buildNode(entryPath, depth + 1);
            children.push(childNode);
          } catch (error) {
            // 跳过无法访问的文件/目录
            console.warn(`Warning: Cannot access ${entryPath}`);
          }
        }

        // 排序：目录优先，然后按名称排序
        children.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });

        node.children = children;
      } catch (error) {
        console.warn(`Warning: Cannot read directory ${filePath}`);
      }
    } else {
      this.stats.totalFiles++;
      if (node.size) {
        this.stats.totalSize += node.size;
      }
    }

    return node;
  }

  private shouldExclude(name: string, fullPath: string): boolean {
    // 检查排除模式
    for (const pattern of this.options.exclude) {
      if (
        this.matchPattern(name, pattern) ||
        this.matchPattern(fullPath, pattern)
      ) {
        return true;
      }
    }

    // 检查正则表达式忽略模式
    if (this.options.ignorePattern && this.options.ignorePattern.test(name)) {
      return true;
    }

    return false;
  }

  private shouldIncludeFile(fileName: string): boolean {
    const ext = path.extname(fileName).toLowerCase();

    // 如果指定了包含类型，只包含指定类型
    if (this.options.includeTypes.length > 0) {
      return this.options.includeTypes.some(
        type => ext === (type.startsWith('.') ? type : `.${type}`)
      );
    }

    // 如果指定了排除类型，排除指定类型
    if (this.options.excludeTypes.length > 0) {
      return !this.options.excludeTypes.some(
        type => ext === (type.startsWith('.') ? type : `.${type}`)
      );
    }

    return true;
  }

  private matchPattern(text: string, pattern: string): boolean {
    // 简单的 glob 模式匹配
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(text);
  }

  public getStats(): TreeStats {
    return this.stats;
  }
}
