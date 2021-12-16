import React, { LabelHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle } from "react-icons/fi";

type InputProps = {
  error?: string;
  translationKey?: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputComponent = ({
  error,
  translationKey = "",
  className,
  labelProps,
  ...props
}: InputProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="input">
      <label htmlFor={translationKey} className="input__label" {...labelProps}>
        {t(translationKey)}
      </label>
      <input
        aria-labelledby={translationKey}
        className={`input__box ${className}`}
        {...props}
      />
      {!!error && (
        <span className="input__error">
          <FiAlertTriangle style={{ marginRight: 8 }} />
          {t(error)}
        </span>
      )}
    </div>
  );
};

export default InputComponent;
