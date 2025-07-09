export interface TreeOptions {
  /** 目标目录路径 */
  path: string;
  /** 最大遍历深度，-1 表示无限制 */
  maxDepth: number;
  /** 输出格式 */
  format: 'text' | 'json' | 'markdown';
  /** 排除的文件/文件夹模式 */
  exclude: string[];
  /** 包含的文件类型（扩展名） */
  includeTypes: string[];
  /** 排除的文件类型（扩展名） */
  excludeTypes: string[];
  /** 正则表达式忽略模式 */
  ignorePattern?: RegExp;
  /** 是否显示隐藏文件 */
  showHidden: boolean;
  /** 是否显示文件大小 */
  showSize: boolean;
  /** 是否显示修改时间 */
  showDate: boolean;
  /** 是否只显示目录 */
  dirsOnly: boolean;
  /** 是否使用彩色输出 */
  colorize: boolean;
}

export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modifiedTime?: Date;
  children?: FileNode[];
  depth: number;
}

export interface TreeStats {
  totalFiles: number;
  totalDirectories: number;
  totalSize: number;
}
