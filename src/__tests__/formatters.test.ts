import { TextFormatter, JsonFormatter, MarkdownFormatter } from '../formatters';
import { TreeOptions, FileNode, TreeStats } from '../types';

describe('Formatters', () => {
  const mockOptions: TreeOptions = {
    path: '/test',
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

  const mockTree: FileNode = {
    name: 'root',
    path: '/test',
    isDirectory: true,
    depth: 0,
    children: [
      {
        name: 'dir1',
        path: '/test/dir1',
        isDirectory: true,
        depth: 1,
        children: [
          {
            name: 'file1.txt',
            path: '/test/dir1/file1.txt',
            isDirectory: false,
            depth: 2,
            size: 100,
          },
        ],
      },
      {
        name: 'file2.js',
        path: '/test/file2.js',
        isDirectory: false,
        depth: 1,
        size: 200,
      },
    ],
  };

  const mockStats: TreeStats = {
    totalFiles: 2,
    totalDirectories: 2,
    totalSize: 300,
  };

  describe('TextFormatter', () => {
    test('should format basic tree structure', () => {
      const formatter = new TextFormatter(mockOptions);
      const result = formatter.format(mockTree, mockStats);

      expect(result).toContain('root');
      expect(result).toContain('├── dir1');
      expect(result).toContain('│   └── file1.txt');
      expect(result).toContain('└── file2.js');
      expect(result).toContain('2 directories, 2 files');
    });

    test('should show file sizes when enabled', () => {
      const optionsWithSize = { ...mockOptions, showSize: true };
      const formatter = new TextFormatter(optionsWithSize);
      const result = formatter.format(mockTree, mockStats);

      expect(result).toContain('(100B)');
      expect(result).toContain('(200B)');
      expect(result).toContain('300B total');
    });
  });

  describe('JsonFormatter', () => {
    test('should format tree as valid JSON', () => {
      const formatter = new JsonFormatter(mockOptions);
      const result = formatter.format(mockTree, mockStats);

      const parsed = JSON.parse(result);
      expect(parsed.tree.name).toBe('root');
      expect(parsed.tree.children).toHaveLength(2);
      expect(parsed.stats.totalFiles).toBe(2);
      expect(parsed.stats.totalDirectories).toBe(2);
    });
  });

  describe('MarkdownFormatter', () => {
    test('should format tree as markdown', () => {
      const formatter = new MarkdownFormatter(mockOptions);
      const result = formatter.format(mockTree, mockStats);

      expect(result).toContain('# Directory Tree: root');
      expect(result).toContain('- **dir1**/');
      expect(result).toContain('  - file1.txt');
      expect(result).toContain('- file2.js');
      expect(result).toContain('## Statistics');
      expect(result).toContain('**Directories**: 2');
      expect(result).toContain('**Files**: 2');
    });
  });
});
