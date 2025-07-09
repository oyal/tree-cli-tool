import { TreeBuilder } from './tree-builder';
import {
  createFormatter,
  TextFormatter,
  JsonFormatter,
  MarkdownFormatter,
} from './formatters';
import { TreeOptions, FileNode, TreeStats } from './types';

// 导出所有类型和类
export { TreeBuilder } from './tree-builder';
export {
  createFormatter,
  TextFormatter,
  JsonFormatter,
  MarkdownFormatter,
} from './formatters';
export { TreeOptions, FileNode, TreeStats } from './types';

// 主要的 API 函数
export async function generateTree(
  options: Partial<TreeOptions> & { path: string }
) {
  const defaultOptions: TreeOptions = {
    maxDepth: -1,
    format: 'text',
    exclude: [],
    includeTypes: [],
    excludeTypes: [],
    showHidden: false,
    showSize: false,
    showDate: false,
    dirsOnly: false,
    colorize: true,
    ...options,
    path: options.path,
  };

  const treeBuilder = new TreeBuilder(defaultOptions);
  const { tree, stats } = await treeBuilder.buildTree();
  const formatter = createFormatter(defaultOptions);

  return {
    tree,
    stats,
    formatted: formatter.format(tree, stats),
  };
}
