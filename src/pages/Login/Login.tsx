import React from "react";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import styles from "./Login.module.scss";

const Login: React.FC = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
