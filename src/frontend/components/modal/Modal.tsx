import * as React from 'react';

import { File } from '../../types';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FunctionComponent<ModalProps> = ({
  isOpen,
  children,
  ...rest
}) => {
  return isOpen ? (
    // TODO: Ally: Screen reader support / live region announcements; focus management
    //       e.g., configurable updateable content; `react-focus-on`
    <div className="Modal" aria-modal {...rest}>
      <div className="Modal__body">{children}</div>
    </div>
  ) : null;
};

type ModalState = {
  type: 'file' | 'directory';
  parent: File;
} | null;

export interface ModalManagement {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}

export const useModal = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => void,
  ModalState,
  React.Dispatch<React.SetStateAction<ModalState>>
] => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalState, setModalState] = React.useState<ModalState>(null);
  const toggleModal = () => setIsModalOpen((isModalOpen) => !isModalOpen);

  return [isModalOpen, setIsModalOpen, toggleModal, modalState, setModalState];
};
