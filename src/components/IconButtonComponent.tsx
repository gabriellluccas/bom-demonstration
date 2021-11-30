import React from "react";
import { useTranslation } from "react-i18next";
import { IconBaseProps, IconType } from "react-icons";
import { ButtonProps } from "./ButtonComponent";

type IconButtonProps = {
  Icon: IconType;
  iconProps?: IconBaseProps;
} & ButtonProps;

const IconButtonComponent = ({
  Icon,
  translationKey,
  type = "button",
  className,
  disabled,
  iconProps,
  ...props
}: IconButtonProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <button
      type={type}
      title={t(translationKey)}
      className={`icon-button ${
        disabled && "icon-button--disabled"
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      <Icon className="icon-button__inside" {...iconProps} />
    </button>
  );
};

export default IconButtonComponent;
