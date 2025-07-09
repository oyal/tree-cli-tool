import chalk from 'chalk';
import { FileNode, TreeStats, TreeOptions } from './types';

export abstract class BaseFormatter {
  protected options: TreeOptions;

  constructor(options: TreeOptions) {
    this.options = options;
  }

  abstract format(tree: FileNode, stats: TreeStats): string;

  protected formatSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let formattedSize = size;

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex++;
    }

    return `${formattedSize.toFixed(unitIndex > 0 ? 1 : 0)}${units[unitIndex]}`;
  }

  protected formatDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}

export class TextFormatter extends BaseFormatter {
  private static readonly TREE_SYMBOLS = {
    branch: '├── ',
    lastBranch: '└── ',
    vertical: '│   ',
    space: '    ',
  };

  format(tree: FileNode, stats: TreeStats): string {
    const lines: string[] = [];

    // 添加根目录
    lines.push(this.formatNode(tree, '', true, true));

    // 递归添加子节点
    if (tree.children) {
      this.formatChildren(tree.children, '', lines);
    }

    // 添加统计信息
    lines.push('');
    lines.push(this.formatStats(stats));

    return lines.join('\n');
  }

  private formatChildren(
    children: FileNode[],
    prefix: string,
    lines: string[]
  ): void {
    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      const symbol = isLast
        ? TextFormatter.TREE_SYMBOLS.lastBranch
        : TextFormatter.TREE_SYMBOLS.branch;
      const nextPrefix =
        prefix +
        (isLast
          ? TextFormatter.TREE_SYMBOLS.space
          : TextFormatter.TREE_SYMBOLS.vertical);

      lines.push(this.formatNode(child, prefix + symbol, false, isLast));

      if (child.children && child.children.length > 0) {
        this.formatChildren(child.children, nextPrefix, lines);
      }
    });
  }

  private formatNode(
    node: FileNode,
    prefix: string,
    isRoot: boolean,
    isLast: boolean
  ): string {
    let line = prefix + node.name;

    // 添加文件大小信息（只对文件显示，不对目录显示）
    if (this.options.showSize && node.size !== undefined && !node.isDirectory) {
      line += ` (${this.formatSize(node.size)})`;
    }

    // 添加修改时间信息
    if (this.options.showDate && node.modifiedTime) {
      line += ` [${this.formatDate(node.modifiedTime)}]`;
    }

    // 应用颜色
    if (this.options.colorize) {
      if (node.isDirectory) {
        line = chalk.blue.bold(line);
      } else {
        const ext = node.name.split('.').pop()?.toLowerCase();
        switch (ext) {
          case 'js':
          case 'ts':
          case 'jsx':
          case 'tsx':
            line = chalk.yellow(line);
            break;
          case 'json':
            line = chalk.green(line);
            break;
          case 'md':
          case 'txt':
            line = chalk.white(line);
            break;
          case 'css':
          case 'scss':
          case 'sass':
            line = chalk.magenta(line);
            break;
          case 'html':
          case 'htm':
            line = chalk.red(line);
            break;
          default:
            line = chalk.gray(line);
        }
      }
    }

    return line;
  }

  private formatStats(stats: TreeStats): string {
    let result = `${stats.totalDirectories} directories, ${stats.totalFiles} files`;

    if (this.options.showSize) {
      result += `, ${this.formatSize(stats.totalSize)} total`;
    }

    return this.options.colorize ? chalk.cyan(result) : result;
  }
}

export class JsonFormatter extends BaseFormatter {
  format(tree: FileNode, stats: TreeStats): string {
    const result = {
      tree: this.nodeToJson(tree),
      stats,
    };
    return JSON.stringify(result, null, 2);
  }

  private nodeToJson(node: FileNode): any {
    const result: any = {
      name: node.name,
      path: node.path,
      isDirectory: node.isDirectory,
      depth: node.depth,
    };

    if (node.size !== undefined) {
      result.size = node.size;
    }

    if (node.modifiedTime) {
      result.modifiedTime = node.modifiedTime.toISOString();
    }

    if (node.children && node.children.length > 0) {
      result.children = node.children.map(child => this.nodeToJson(child));
    }

    return result;
  }
}

export class MarkdownFormatter extends BaseFormatter {
  format(tree: FileNode, stats: TreeStats): string {
    const lines: string[] = [];

    lines.push(`# Directory Tree: ${tree.name}`);
    lines.push('');

    // 添加根目录
    lines.push(`- **${tree.name}**${tree.isDirectory ? '/' : ''}`);

    // 递归添加子节点
    if (tree.children) {
      this.formatChildren(tree.children, 1, lines);
    }

    // 添加统计信息
    lines.push('');
    lines.push('## Statistics');
    lines.push('');
    lines.push(`- **Directories**: ${stats.totalDirectories}`);
    lines.push(`- **Files**: ${stats.totalFiles}`);

    if (this.options.showSize) {
      lines.push(`- **Total Size**: ${this.formatSize(stats.totalSize)}`);
    }

    return lines.join('\n');
  }

  private formatChildren(
    children: FileNode[],
    depth: number,
    lines: string[]
  ): void {
    const indent = '  '.repeat(depth);

    children.forEach(child => {
      let line = `${indent}- `;

      if (child.isDirectory) {
        line += `**${child.name}**/`;
      } else {
        line += child.name;
      }

      // 添加文件大小信息（只对文件显示，不对目录显示）
      if (
        this.options.showSize &&
        child.size !== undefined &&
        !child.isDirectory
      ) {
        line += ` _(${this.formatSize(child.size)})_`;
      }

      lines.push(line);

      if (child.children && child.children.length > 0) {
        this.formatChildren(child.children, depth + 1, lines);
      }
    });
  }
}

export function createFormatter(options: TreeOptions): BaseFormatter {
  switch (options.format) {
    case 'json':
      return new JsonFormatter(options);
    case 'markdown':
      return new MarkdownFormatter(options);
    case 'text':
    default:
      return new TextFormatter(options);
  }
}
