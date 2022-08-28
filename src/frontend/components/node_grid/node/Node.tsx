import * as React from 'react';
import clsx from 'clsx';
import {
  FileDirectoryFillIcon,
  FileBinaryIcon,
  FileCodeIcon,
  FileIcon,
  FileMediaIcon,
  FileZipIcon,
  MarkdownIcon,
  IconProps,
} from '@primer/octicons-react';

import { File as FileType } from '../../../types';
import { AppContext } from '../../../App';

import { Button } from '../../button';

interface NodeAltProps extends React.HTMLAttributes<HTMLDivElement> {
  node: FileType;
}

export const NodeAlt: React.FunctionComponent<NodeAltProps> = ({
  node,
  ...rest
}) => {
  const { children, name } = node;
  const { setSelected } = React.useContext(AppContext);

  const _setSelected = () => setSelected({ node });

  const fileClass = clsx('NodeAlt');

  return (
    <div className={fileClass} {...rest}>
      <Button className="NodeAlt__button" onClick={_setSelected}>
        <span className="NodeAlt__icon">
          {children ? (
            <FileDirectoryFillIcon size="medium" />
          ) : (
            <FileIcons fileName={name} />
          )}
        </span>
        <span className="NodeAlt__name">{name}</span>
      </Button>
    </div>
  );
};

const FileIcons = ({ fileName }: { fileName: string }) => {
  const props: IconProps = { size: 'medium' };
  const extension = fileName.split('.').pop();
  switch (extension) {
    case 'tsx':
    case 'svg':
    case 'html':
      return <FileCodeIcon {...props} />;
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'png':
      return <FileMediaIcon {...props} />;
    case 'pdf':
    case 'exe':
    case 'jar':
      return <FileBinaryIcon {...props} />;
    case 'zip':
    case 'gz':
    case 'tar':
      return <FileZipIcon {...props} />;
    case 'markdown':
    case 'md':
      return <MarkdownIcon {...props} />;
    default:
      return <FileIcon {...props} />;
  }
};
