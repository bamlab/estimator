import { Button, Input } from "@nextui-org/react";
import styles from "../styles/Home.module.css";
import wretch from "wretch";
import { ROOT_URL } from "../src/constants";
import { FormEventHandler, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [emailError, setEmailError] = useState("");

  const subscribe: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Email invalide");
      return;
    }

    const response = await wretch(`${ROOT_URL}/preview`)
      .post({
        email,
      })
      .res();

    if (response.status === 200) {
      setIsSubscribed(true);
    } else {
      setHasError(true);
    }
  };

  const isFormSubmited = isSubscribed || hasError;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the M33 Delivery Management System
        </h1>

        <div className={styles.grid}>
          <h3>This is an alpha test application with restricted access</h3>
          <p>
            Subscribe to be notified as soon as the application is available in
            beta test :{" "}
          </p>
        </div>
        <div>
          {isFormSubmited ? (
            hasError ? (
              <p>❌ An error occured. Please, try again</p>
            ) : (
              <p>
                ✅ you have been successfully registered to the beta ! See you
                soon 🤗
              </p>
            )
          ) : (
            <form onSubmit={subscribe}>
              <Input
                type="email"
                label="Email"
                onChange={(e) => setEmail(e.currentTarget.value)}
                helperText={emailError}
                status={emailError ? "error" : "default"}
              />
              <br />
              <br />
              <Button type="submit">Subscribe</Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
