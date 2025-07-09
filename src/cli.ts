#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { TreeBuilder } from './tree-builder';
import { createFormatter } from './formatters';
import { TreeOptions } from './types';

const program = new Command();

program
  .name('tree-cli')
  .description(
    'A powerful command-line tool to display directory tree structure'
  )
  .version('1.0.0')
  .argument('[path]', 'Target directory path', '.')
  .option('-d, --max-depth <number>', 'Maximum depth of the tree', '-1')
  .option('-f, --format <type>', 'Output format (text|json|markdown)', 'text')
  .option('-e, --exclude <patterns...>', 'Additional exclude patterns', [])
  .option('-s, --show-size', 'Show file sizes', false)
  .option('--show-date', 'Show modification dates', false)
  .option('-a, --show-hidden', 'Show hidden files and directories', false)
  .option('-D, --dirs-only', 'Show only directories', false)
  .option('--no-color', 'Disable colored output')
  .option('-o, --output <file>', 'Output to file instead of stdout')
  .action(async (targetPath: string, options: any) => {
    try {
      // 验证目标路径
      const resolvedPath = path.resolve(targetPath);

      if (!fs.existsSync(resolvedPath)) {
        console.error(`Error: Path "${resolvedPath}" does not exist.`);
        process.exit(1);
      }

      const stat = fs.statSync(resolvedPath);
      if (!stat.isDirectory()) {
        console.error(`Error: Path "${resolvedPath}" is not a directory.`);
        process.exit(1);
      }

      // 构建配置选项
      const treeOptions: TreeOptions = {
        path: resolvedPath,
        maxDepth: parseInt(options.maxDepth),
        format: options.format,
        exclude: options.exclude || [],
        includeTypes: options.includeTypes || [],
        excludeTypes: options.excludeTypes || [],
        ignorePattern: options.ignorePattern
          ? new RegExp(options.ignorePattern)
          : undefined,
        showHidden: options.showHidden,
        showSize: options.showSize,
        showDate: options.showDate,
        dirsOnly: options.dirsOnly,
        colorize: options.color,
      };

      // 验证格式选项
      if (!['text', 'json', 'markdown'].includes(treeOptions.format)) {
        console.error(
          `Error: Invalid format "${treeOptions.format}". Supported formats: text, json, markdown`
        );
        process.exit(1);
      }

      // 构建目录树
      console.error('Building directory tree...');
      const treeBuilder = new TreeBuilder(treeOptions);
      const { tree, stats } = await treeBuilder.buildTree();

      // 格式化输出
      const formatter = createFormatter(treeOptions);
      const output = formatter.format(tree, stats);

      // 输出结果
      if (options.output) {
        fs.writeFileSync(options.output, output);
        console.error(`Tree structure saved to: ${options.output}`);
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(
        `Error: ${
          error instanceof Error ? error.message : 'Unknown error occurred'
        }`
      );
      process.exit(1);
    }
  });

// 添加一些预设命令
program
  .command('quick')
  .description('Quick tree view with common settings')
  .argument('[path]', 'Target directory path', '.')
  .option('-d, --max-depth <number>', 'Maximum depth', '3')
  .option('-f, --format <type>', 'Output format (text|json|markdown)', 'text')
  .option('-e, --exclude <patterns...>', 'Additional exclude patterns', [])
  .option('-s, --show-size', 'Show file sizes', false)
  .option('--show-date', 'Show modification dates', false)
  .option('-a, --show-hidden', 'Show hidden files and directories', false)
  .option('-D, --dirs-only', 'Show only directories', false)
  .option('--no-color', 'Disable colored output')
  .option('-o, --output <file>', 'Output to file instead of stdout')
  .action(async (targetPath: string) => {
    const options = program.opts();
    const defaultExcludes = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      '.nuxt',
    ];

    const quickOptions = {
      path: path.resolve(targetPath),
      maxDepth: parseInt(options.maxDepth),
      format: options.format,
      exclude: [...defaultExcludes, ...(options.exclude || [])],
      includeTypes: [],
      excludeTypes: [],
      showHidden: options.showHidden,
      showSize: options.showSize,
      showDate: options.showDate,
      dirsOnly: options.dirsOnly,
      colorize: options.color,
    };

    try {
      const treeBuilder = new TreeBuilder(quickOptions);
      const { tree, stats } = await treeBuilder.buildTree();
      const formatter = createFormatter(quickOptions);
      const output = formatter.format(tree, stats);

      // 输出结果
      if (options.output) {
        fs.writeFileSync(options.output, output);
        console.error(`Tree structure saved to: ${options.output}`);
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(
        `Error: ${
          error instanceof Error ? error.message : 'Unknown error occurred'
        }`
      );
      process.exit(1);
    }
  });

program
  .command('dev')
  .description(
    'Development-focused tree view (excludes common build/cache directories)'
  )
  .argument('[path]', 'Target directory path', '.')
  .option('-d, --max-depth <number>', 'Maximum depth')
  .option('-f, --format <type>', 'Output format (text|json|markdown)')
  .option('-e, --exclude <patterns...>', 'Additional exclude patterns')
  .option('-s, --show-size', 'Show file sizes')
  .option('--show-date', 'Show modification dates')
  .option('-a, --show-hidden', 'Show hidden files and directories')
  .option('-D, --dirs-only', 'Show only directories')
  .option('--no-color', 'Disable colored output')
  .option('-o, --output <file>', 'Output to file instead of stdout')
  .action(async (targetPath: string) => {
    const options = program.opts();
    const defaultExcludes = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      '.nuxt',
      'coverage',
      '.nyc_output',
      '.cache',
      'tmp',
      'temp',
      '*.log',
      '.DS_Store',
      'Thumbs.db',
    ];

    const devOptions = {
      path: path.resolve(targetPath),
      maxDepth: options.maxDepth ? parseInt(options.maxDepth) : 4,
      format: options.format || 'text',
      exclude: [...defaultExcludes, ...(options.exclude || [])],
      includeTypes: [],
      excludeTypes: [],
      showHidden: options.showHidden || false,
      showSize: options.showSize || false,
      showDate: options.showDate || false,
      dirsOnly: options.dirsOnly || false,
      colorize: !options.noColor,
    };

    try {
      const treeBuilder = new TreeBuilder(devOptions);
      const { tree, stats } = await treeBuilder.buildTree();
      const formatter = createFormatter(devOptions);
      const output = formatter.format(tree, stats);

      // 输出结果
      if (options.output) {
        fs.writeFileSync(options.output, output);
        console.error(`Tree structure saved to: ${options.output}`);
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(
        `Error: ${
          error instanceof Error ? error.message : 'Unknown error occurred'
        }`
      );
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse();
