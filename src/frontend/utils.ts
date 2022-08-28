import sha1 from 'sha1';

import { GitHubTreeNode, File, FileTree } from './types';

export const assertNever = (x: never): never => {
  throw new Error(`Unexpected value ${x}`);
};

export const findNestedById = (data: File[], id: string): File | false => {
  for (const node of data) {
    if (node.id === id) {
      return node;
    }
    if ('children' in node) {
      const childNode = findNestedById(node.children, id);
      if (childNode) {
        return childNode;
      }
    }
  }
  return false;
};

export const removeNestedById = (files: File[], id: File['id']): File[] => {
  const newFiles = files
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      ...(node.children && {
        children: removeNestedById(node.children, id),
      }),
    }));
  return newFiles;
};

const buildFile = (
  name: File['name'],
  parentId: File['id'],
  isDirectory: boolean
): File => {
  const sha = sha1(name + parentId);
  return {
    name,
    path: '',
    sha,
    id: `${sha}_${name}`,
    size: 0,
    children: isDirectory ? [] : undefined,
  };
};

export const addNestedByParentId = (
  files: File[],
  parentId: File['id'],
  fileName: File['name'],
  isDirectory = false
): File[] => {
  const newFiles = files.map((node) => {
    if (node.id === parentId) {
      const newFile = buildFile(fileName, parentId, isDirectory);
      return {
        ...node,
        children: [newFile, ...node.children].sort((a, b) =>
          a.name > b.name ? 1 : -1
        ),
      };
    }
    return {
      ...node,
      ...(node.children && {
        children: addNestedByParentId(
          node.children,
          parentId,
          fileName,
          isDirectory
        ),
      }),
    };
  });
  return newFiles;
};

const isDotFile = (str: string) => str.charAt(0) === '.';
export const addToRoot = (
  files: File[],
  fileName: File['name'],
  isDirectory = false
): File[] => {
  const newFile = buildFile(fileName, null, isDirectory);
  const newFiles = [newFile, ...files].sort((a, b) => {
    const aDot = isDotFile(a.name);
    const bDot = isDotFile(b.name);
    if (!aDot && bDot) return 1;
    if (aDot && !bDot) return -1;
    return a.name > b.name ? 1 : -1;
  });
  return newFiles;
};

// Transform GitHub API results

export const buildTree = (
  file: Omit<GitHubTreeNode, 'path'> & { path: string[] },
  tree = {}
) => {
  const { path, ...rest } = file;
  const part = path.shift();
  const id = `${rest.sha}_${part}`;
  const current = tree[part] || (tree[part] = { name: part, id, ...rest });
  if (path.length) {
    buildTree(file, current.children || (current.children = {}));
  }
  return tree;
};

export const transformTree = (tree: FileTree | File[], parent?: string) => {
  const files = Object.values(tree);
  files
    .map((file) => Object.assign(file, { parent })) // TODO: Spread syntax not working
    .filter((file) => file.children)
    .forEach((file) => {
      file.children = transformTree(file.children, file.id);
    });

  return files;
};

export const treeToFiles = (data: GitHubTreeNode[]) => {
  const fileTree: FileTree = data.reduce(
    (tree, file) => buildTree({ ...file, path: file.path.split('/') }, tree),
    {}
  );

  return transformTree(fileTree);
};
