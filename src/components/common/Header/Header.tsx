import React from "react";
import Button from "../Button/Button";
import styles from "./Header.module.scss";

interface HeaderProps {
  userName: string;
  userRole: "editor" | "viewer";
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole, onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Some Shop</span>
        </div>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span
              className={styles.userName}
            >{`${userName} (${userRole})`}</span>
          </div>

          <Button onClick={onLogout} size="small">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
