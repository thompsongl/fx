import * as React from 'react';
import { FileIcon, FileDirectoryIcon, TrashIcon } from '@primer/octicons-react';

import { Button } from '../button';

interface ActionsProps {
  addFile?: () => void;
  addDirectory?: () => void;
  removeNode?: () => void;
  type: 'directory' | 'file';
}

export const Actions: React.FunctionComponent<ActionsProps> = ({
  addFile,
  addDirectory,
  removeNode,
  type,
}) => {
  return (
    <>
      {addFile && (
        <Button variant="create" onClick={addFile} title="Add file">
          <FileIcon verticalAlign="middle" />
        </Button>
      )}
      {addDirectory && (
        <Button variant="create" onClick={addDirectory} title="Add directory">
          <FileDirectoryIcon verticalAlign="middle" />
        </Button>
      )}
      {removeNode && (
        <Button variant="delete" onClick={removeNode} title={`Remove ${type}`}>
          <TrashIcon verticalAlign="middle" />
        </Button>
      )}
    </>
  );
};
