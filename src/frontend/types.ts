export interface GitHubTreeNode {
  name: string;
  path: string;
  sha: string;
  size?: number;
  url?: string;
}

export interface File extends GitHubTreeNode {
  id: string;
  parent?: string;
  children?: File[];
}

export type CreateFile = Omit<File, 'path' | 'sha' | 'id'>;

export type FileTree = { [key: string]: File };
