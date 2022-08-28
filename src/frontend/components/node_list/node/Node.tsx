import * as React from 'react';
import clsx from 'clsx';
import {
  ChevronRightIcon,
  FileIcon,
  FileDirectoryIcon,
} from '@primer/octicons-react';

import { File } from '../../../types';
import { AppContext } from '../../../App';

import { Actions } from '../../actions';
import { Button } from '../../button';
import { NodeList } from '..';

interface NodeProps extends React.HTMLAttributes<HTMLDivElement> {
  node: File;
}

export const Node: React.FunctionComponent<NodeProps> = ({ node, ...rest }) => {
  const { children, name } = node;
  const { selected, setSelected, removeNode, addDirectory, addFile } =
    React.useContext(AppContext);
  const isSelected = node.id === selected;

  const [isOpen, setIsOpen] = React.useState(false);

  const _setSelected = () => setSelected({ node });
  const _addFile = () => addFile(node);
  const _addDirectory = () => addDirectory(node);
  const _removeNode = () => removeNode({ nodeId: node.id });

  const nodeClass = clsx('Node', {
    'Node-isSelected': isSelected,
  });

  const nodeToggleClass = clsx('Node__toggle', {
    'Node__toggle-isOpen': isOpen,
  });

  const nodeButtonClass = clsx('Node__button', {
    'Node__button--file': !children,
    'Node__button-isOpen': isOpen,
  });

  return (
    <div className={nodeClass} {...rest}>
      <div className="Node__wrapper">
        {children ? (
          <Button
            className={nodeToggleClass}
            onClick={() => setIsOpen((isOpen) => !isOpen)}
            title={`${isOpen ? 'Collapse' : 'Expand'} directory`}
          >
            <ChevronRightIcon verticalAlign="middle" />
          </Button>
        ) : (
          <span className="Node__spacer" />
        )}
        <Button className={nodeButtonClass} onClick={_setSelected}>
          <span className="Node__icon">
            {children ? <FileDirectoryIcon /> : <FileIcon />}
          </span>
          <span>{name}</span>
        </Button>
        {isSelected && (
          <Actions
            type={children ? 'directory' : 'file'}
            addFile={children && _addFile}
            addDirectory={children && _addDirectory}
            removeNode={_removeNode}
          />
        )}
      </div>
      {children && isOpen && <NodeList nodes={children} />}
    </div>
  );
};
