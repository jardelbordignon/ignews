import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | IgNews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href='#'>
            <time>19 de abril de 2021</time>
            <strong>Create a Monorepo</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process
            </p>
          </a>
          <a href='#'>
            <time>19 de abril de 2021</time>
            <strong>Create a Monorepo</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process
            </p>
          </a>
          <a href='#'>
            <time>19 de abril de 2021</time>
            <strong>Create a Monorepo</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
