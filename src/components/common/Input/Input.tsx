import React, { forwardRef, useState } from "react";
import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={styles.inputWrapper}>
        {label && <label>{label}</label>}
        <div
          className={`
            ${styles.inputContainer} 
            ${isFocused ? styles.focused : ""} 
            ${error ? styles.hasError : ""}
          `}
        >
          <input
            ref={ref}
            {...props}
            className={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <div className={styles.focusLine} />
        </div>

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
