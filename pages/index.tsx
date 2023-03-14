import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Estimator</title>
        <meta
          name="description"
          content="Estimation tools for your tech project"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Image src="/logo.svg" alt="Estimator logo" width={200} height={200} />
        <h2>Welcome to the </h2>
        <h1 className={styles.title}>M33 Delivery Management System</h1>

        <div className={styles.grid}>
          <Link href="/db">
            <a className={styles.card}>
              <h2>Estimation database &rarr;</h2>
              <p>Find all estimated features to prepare a project</p>
            </a>
          </Link>

          <Link href="/projects">
            <a className={styles.card}>
              <h2>Projects &rarr;</h2>
              <p>Start here to have a project visual management</p>
            </a>
          </Link>
        </div>
        <Button onClick={() => signOut()} size="xs" light>
          Logout
        </Button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
