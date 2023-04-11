import { GetServerSideProps } from 'next'
import { ChangeEvent, useState, FormEvent, useEffect } from 'react'
import styles from './styles.module.css'
import Head from 'next/head'

import { getSession } from 'next-auth/react'
import Textarea from '@/src/components/Textarea'

import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'

import { db } from '../../services/firebaseConnection'
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot
} from 'firebase/firestore'

interface HomeProps {
  user: {
    email: string
  }
}

interface TaskProps {
  id: string
  created: Date
  public: boolean
  tarefa: string
  user: string
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState('')
  const [publicTask, setPublicTask] = useState(false)
  const [tasks, setTasks] = useState<TaskProps[]>([])

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, 'tarefas')

      const q = query(
        tarefasRef,
        orderBy('created', 'desc'),
        where('user', '==', user?.email)
      )

      onSnapshot(q, snapshot => {
        let lista = [] as TaskProps[]

        snapshot.forEach(doc => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public
          })
        })

        setTasks(lista)
      })
    }

    loadTarefas()
  }, [user?.email])

  function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
    setPublicTask(e.target.checked)
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
  }

  async function handleRegisterTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (input === '') return

    try {
      // Após criar uma coleção, nossa primeira conexão é com o nosso banco de dados no Firebase e depois colocamos o nome dessa coleção
      await addDoc(collection(db, 'tarefas'), {
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: publicTask
      })

      setInput('')
      setPublicTask(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual a sua tarefa</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Digite qual a sua tarefa"
                value={input}
                onChange={handleChange}
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Deixar tarefa pública</label>
              </div>
              <button type="submit" className={styles.button}>
                Registrar
              </button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>

          {tasks.map(item => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>Público</label>
                  <button className={styles.shareButton}>
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}
              <div className={styles.taskContent}>
                <p>{item.tarefa}</p>
                <button className={styles.trashButton}>
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (!session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {
      user: {
        email: session?.user?.email
      }
    }
  }
}
