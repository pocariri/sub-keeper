// Expo + pnpm 모노레포용 Metro 설정.
// 워크스페이스 루트를 watch 하고, 루트/앱 양쪽 node_modules 에서 모듈을 해석한다.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. 모노레포 루트까지 파일 변경 감시 (packages/core 포함)
config.watchFolders = [workspaceRoot];

// 2. 앱과 워크스페이스 루트 양쪽의 node_modules 해석 (node-linker=hoisted)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
