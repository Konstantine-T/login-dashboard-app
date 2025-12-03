import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  loading = false,
  disabled,
  children,
  size = "medium",
  className = "",
  ...props
}) => {
  const buttonClasses = `
    ${styles.button} 
    ${styles[size]}
    ${loading ? styles.loading : ""}
    ${disabled ? styles.disabled : ""}
    ${className}
  `.trim();
  return (
    <button disabled={disabled || loading} className={buttonClasses} {...props}>
      {loading && <span className={styles.spinner}></span>}
      <span className={styles.buttonText}>
        {loading ? "Loading..." : children}
      </span>
    </button>
  );
};

export default Button;
