import * as React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'plain' | 'primary' | 'secondary' | 'create' | 'delete';
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  className,
  children,
  variant = 'plain',
  type = 'button',
  ...rest
}) => {
  const buttonClasses = clsx('Button', `Button--${variant}`, className);

  return (
    <button type={type} className={buttonClasses} {...rest}>
      {children}
    </button>
  );
};
