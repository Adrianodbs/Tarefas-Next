import styles from './styles.module.css'

type HtmlProps<T extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[T] & {
    [key: string]: any
  }

function Textarea({ ...rest }: HtmlProps<'textarea'>) {
  return <textarea className={styles.textarea} {...rest}></textarea>
}

export default Textarea
