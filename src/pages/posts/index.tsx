import { GetStaticProps } from 'next'
import Head from 'next/head'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'

import { getPrimicClient } from '../../services/prismic'
import styles from './styles.module.scss'

interface Post {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | IgNews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { 
            posts.map(post => (
              <a key={ post.slug } href='#'>
                <time>{ post.updatedAt }</time>
                <strong>{ post.title }</strong>
                <p>{ post.excerpt }</p>
              </a>
            ))
          }
          
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrimicClient()

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.content'],
    pageSize: 100
  })

  const posts = response.results.map(post => {
    const firstParagraph = post.data.content.find(content => content.type === 'paragraph')?.text ?? ''
    const updatedAt = new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })

    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: firstParagraph,
      updatedAt
    }
  })

  return {
    props: { posts }
  }
}
