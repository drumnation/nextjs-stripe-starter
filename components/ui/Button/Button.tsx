import cn from 'classnames';
import LoadingDots from 'components/ui/LoadingDots';
import React, { ButtonHTMLAttributes, forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

import styles from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  Component?: React.ComponentType;
  active?: boolean;
  loading?: boolean;
  variant?: 'slim' | 'flat';
  width?: number;
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button(props, buttonRef) {
  const {
    className,
    variant = 'flat',
    children,
    active,
    width,
    loading = false,
    disabled = false,
    style = {},
    Component = 'button',
    ...rest
  } = props;
  const ref = useRef(null);
  const rootClassName = cn(
    styles.root,
    {
      [styles.slim]: variant === 'slim',
      [styles.loading]: loading,
      [styles.disabled]: disabled,
    },
    className
  );
  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])}
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style,
      }}
      {...rest}
    >
      {children}
      {loading && (
        <i className="pl-2 m-0 flex">
          <LoadingDots />
        </i>
      )}
    </Component>
  );
});

export default Button;
