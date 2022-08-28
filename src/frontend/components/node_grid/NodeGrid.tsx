import * as React from 'react';
import clsx from 'clsx';
import { File as FileType } from '../../types';

import { NodeAlt } from './node';

interface NodeGridProps extends React.HTMLAttributes<HTMLElement> {
  nodes: FileType[];
}

export const NodeGrid: React.FunctionComponent<NodeGridProps> = ({
  nodes,
  ...rest
}) => {
  const nodeGridClass = clsx('NodeGrid');

  return (
    <ul className={nodeGridClass} {...rest}>
      {nodes.map((node) => {
        return (
          <li key={node.id} className="NodeGrid__item">
            <NodeAlt node={node} />
          </li>
        );
      })}
    </ul>
  );
};
