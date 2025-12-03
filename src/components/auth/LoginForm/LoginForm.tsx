import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import usersData from "../../../data/users.json";
import { loginSchema } from "./ValidationSchema";
import styles from "./LoginForm.module.scss";
import { useNavigate } from "react-router-dom";

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [loginError, setLoginError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const watchEmail = watch("email");
  const watchPassword = watch("password");
  const isButtonDisabled = !watchEmail || !watchPassword || isSubmitting;

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); //this is just a API call delay simulator ;)

      const user = usersData.users.find(
        (u) => u.email === data.email && u.password === data.password
      );

      if (user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          })
        );

        navigate("/home");
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      setLoginError("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2 className={styles.title}>Login</h2>
        <p className={styles.subtitle}>Sign in to access your dashboard</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        <div className={styles.formGroup}>
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className={styles.formGroup}>
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {loginError && <div className={styles.errorAlert}>{loginError}</div>}

        <Button
          type="submit"
          disabled={isButtonDisabled}
          loading={isSubmitting}
          size="medium"
        >
          Login
        </Button>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerText}>OR</span>
      </div>

      <div className={styles.demoSection}>
        <h4 className={styles.demoTitle}>Demo Credentials:</h4>
        <div style={{ fontSize: "14px" }}>
          <p className={styles.demoCredentialsText}>
            <strong>Editor:</strong> admin@example.com / Admin@123
          </p>
          <p className={styles.demoCredentialsText}>
            <strong>Viewer:</strong> viewer@example.com / Viewer@123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
