import Head from 'next/head'

import styles from '../styles/home.module.scss'

export default function Home() {
  return (
    <>
      <Head>
        <title>Início | ig.news</title>
      </Head>
      
      <h2 className={styles.title}>
        Home <span>Page</span>
      </h2>
    </>
  )
}
