import * as React from 'react';
// import clsx from 'clsx';
import { File } from '../../types';

import { Button } from '../button';
import { AppContext } from '../../App';

interface BreadcrumbsProps extends React.OlHTMLAttributes<HTMLElement> {
  nodes: File[];
}

export const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  nodes,
  ...rest
}) => {
  const { setSelected } = React.useContext(AppContext);
  const breadcrumbs = React.useMemo(() => nodes.slice(-2), [nodes]);

  return (
    <ol className="Breadcrumbs" {...rest}>
      {nodes.length > 2 && (
        <li key="elips" className="Breadcrumbs__item">
          <Button disabled>...</Button>
        </li>
      )}
      {breadcrumbs.map((item) => (
        <li key={item.id} className="Breadcrumbs__item">
          <Button
            className="Breadcrumbs__button"
            onClick={() => setSelected({ node: item })}
          >
            {item.name}
          </Button>
        </li>
      ))}
    </ol>
  );
};
