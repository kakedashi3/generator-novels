import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  async function retry(fn, retries = 3, interval = 1000) {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) {
        throw error;
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          retry(fn, retries - 1, interval)
            .then(resolve)
            .catch(reject);
        }, interval);
      });
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await retry(() =>
        fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ animal: animalInput }),
        })
      );

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>kakedashi novel</title>
        <link rel="icon" href="/frog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/frog.png" className={styles.icon} />
        <h3>Generate Animal Novel</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate novels" />
        </form>
        {loading ? <div>Loading...</div> : <div className={styles.result}>{result}</div>}
      </main>
    </div>
  );
}
