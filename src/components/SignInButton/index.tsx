import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton() {
  const isLoggedIn = false

  return isLoggedIn ?
    <button
      type='button'
      className={styles.signInButton}
    >
      <FaGithub color='#04d361' />
      Jardel Bordignon
      <FiX color='#737380' />
    </button>

    :

    <button
      type='button'
      className={styles.signInButton}
    >
      <FaGithub color='#eba417' />
      Autenticar com Github
    </button>
}
