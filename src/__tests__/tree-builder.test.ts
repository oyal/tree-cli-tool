import * as fs from 'fs';
import * as path from 'path';
import { TreeBuilder } from '../tree-builder';
import { TreeOptions } from '../types';

// 创建测试目录结构的辅助函数
const createTestDir = async (basePath: string, structure: any) => {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = path.join(basePath, name);

    if (typeof content === 'object' && content !== null) {
      // 创建目录
      await fs.promises.mkdir(fullPath, { recursive: true });
      await createTestDir(fullPath, content);
    } else {
      // 创建文件
      await fs.promises.writeFile(fullPath, String(content || ''));
    }
  }
};

describe('TreeBuilder', () => {
  const testDir = path.join(__dirname, 'tmp_rovodev_test');

  beforeEach(async () => {
    // 清理并创建测试目录
    if (fs.existsSync(testDir)) {
      await fs.promises.rm(testDir, { recursive: true });
    }
    await fs.promises.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      await fs.promises.rm(testDir, { recursive: true });
    }
  });

  test('should build basic tree structure', async () => {
    const structure = {
      'file1.txt': 'content1',
      'file2.js': 'content2',
      dir1: {
        'nested.txt': 'nested content',
      },
    };

    await createTestDir(testDir, structure);

    const options: TreeOptions = {
      path: testDir,
      maxDepth: -1,
      format: 'text',
      exclude: [],
      includeTypes: [],
      excludeTypes: [],
      showHidden: false,
      showSize: false,
      showDate: false,
      dirsOnly: false,
      colorize: false,
    };

    const builder = new TreeBuilder(options);
    const { tree, stats } = await builder.buildTree();

    expect(tree.isDirectory).toBe(true);
    expect(tree.children).toHaveLength(3);
    expect(stats.totalFiles).toBe(3);
    expect(stats.totalDirectories).toBe(2); // testDir + dir1
  });

  test('should respect maxDepth option', async () => {
    const structure = {
      level1: {
        level2: {
          level3: {
            'deep.txt': 'deep content',
          },
        },
      },
    };

    await createTestDir(testDir, structure);

    const options: TreeOptions = {
      path: testDir,
      maxDepth: 2,
      format: 'text',
      exclude: [],
      includeTypes: [],
      excludeTypes: [],
      showHidden: false,
      showSize: false,
      showDate: false,
      dirsOnly: false,
      colorize: false,
    };

    const builder = new TreeBuilder(options);
    const { tree } = await builder.buildTree();

    // 应该只有 2 层深度
    const level1 = tree.children?.[0];
    const level2 = level1?.children?.[0];

    expect(level1?.name).toBe('level1');
    expect(level2?.name).toBe('level2');
    expect(level2?.children).toBeUndefined(); // 不应该有第三层
  });

  test('should exclude files based on patterns', async () => {
    const structure = {
      'keep.txt': 'keep this',
      'exclude.log': 'exclude this',
      node_modules: {
        'package.json': '{}',
      },
      src: {
        'index.js': 'code',
      },
    };

    await createTestDir(testDir, structure);

    const options: TreeOptions = {
      path: testDir,
      maxDepth: -1,
      format: 'text',
      exclude: ['*.log', 'node_modules'],
      includeTypes: [],
      excludeTypes: [],
      showHidden: false,
      showSize: false,
      showDate: false,
      dirsOnly: false,
      colorize: false,
    };

    const builder = new TreeBuilder(options);
    const { tree } = await builder.buildTree();

    const childNames = tree.children?.map(child => child.name) || [];
    expect(childNames).toContain('keep.txt');
    expect(childNames).toContain('src');
    expect(childNames).not.toContain('exclude.log');
    expect(childNames).not.toContain('node_modules');
  });

  test('should filter by file types', async () => {
    const structure = {
      'script.js': 'js content',
      'style.css': 'css content',
      'data.json': 'json content',
      'readme.txt': 'text content',
    };

    await createTestDir(testDir, structure);

    const options: TreeOptions = {
      path: testDir,
      maxDepth: -1,
      format: 'text',
      exclude: [],
      includeTypes: ['js', 'json'],
      excludeTypes: [],
      showHidden: false,
      showSize: false,
      showDate: false,
      dirsOnly: false,
      colorize: false,
    };

    const builder = new TreeBuilder(options);
    const { tree } = await builder.buildTree();

    const childNames = tree.children?.map(child => child.name) || [];
    expect(childNames).toContain('script.js');
    expect(childNames).toContain('data.json');
    expect(childNames).not.toContain('style.css');
    expect(childNames).not.toContain('readme.txt');
  });

  test('should handle dirsOnly option', async () => {
    const structure = {
      'file.txt': 'content',
      dir1: {
        'nested.txt': 'nested',
      },
      dir2: {},
    };

    await createTestDir(testDir, structure);

    const options: TreeOptions = {
      path: testDir,
      maxDepth: -1,
      format: 'text',
      exclude: [],
      includeTypes: [],
      excludeTypes: [],
      showHidden: false,
      showSize: false,
      showDate: false,
      dirsOnly: true,
      colorize: false,
    };

    const builder = new TreeBuilder(options);
    const { tree } = await builder.buildTree();

    const childNames = tree.children?.map(child => child.name) || [];
    expect(childNames).toContain('dir1');
    expect(childNames).toContain('dir2');
    expect(childNames).not.toContain('file.txt');
  });
});
