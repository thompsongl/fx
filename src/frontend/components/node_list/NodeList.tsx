import * as React from 'react';
import clsx from 'clsx';
import { File } from '../../types';

import { Node } from './node';
import { Actions } from '../actions';
import { AppContext } from '../../App';

const NodeListContext = React.createContext({
  nestLevel: 0,
});

interface NodeListProps extends React.HTMLAttributes<HTMLElement> {
  nodes: File[];
}

export const NodeList: React.FunctionComponent<NodeListProps> = ({
  nodes,
  ...rest
}) => {
  const { addFile, addDirectory } = React.useContext(AppContext);
  const { nestLevel } = React.useContext(NodeListContext);
  const isNested = nestLevel > 0;
  const multiplier = isNested ? 1.5 : 0;
  const indent = React.useMemo(
    () =>
      getComputedStyle(document.documentElement).getPropertyValue(
        '--space-2'
      ) || 8,
    []
  );

  const _addDirectory = () => addDirectory(null);
  const _addFile = () => addFile(null);

  const nodeListClass = clsx('NodeList', isNested && 'NodeList--nested');

  return (
    <NodeListContext.Provider value={{ nestLevel: nestLevel + 1 }}>
      <ul
        className={nodeListClass}
        style={{ marginInlineStart: `calc(${indent} * ${multiplier})` }}
        {...rest}
      >
        {nestLevel === 0 && (
          <li className="NodeList__item NodeList__item--root">
            <span>.</span>
            <div>
              <Actions
                type="directory"
                addDirectory={_addDirectory}
                addFile={_addFile}
              />
            </div>
          </li>
        )}
        {nodes.length > 0 ? (
          nodes.map((node) => {
            return (
              <li key={node.id} className="NodeList__item">
                <Node node={node} />
              </li>
            );
          })
        ) : (
          <li className="NodeList__item NodeList__item--empty">
            <em>Empty</em>
          </li>
        )}
      </ul>
    </NodeListContext.Provider>
  );
};
