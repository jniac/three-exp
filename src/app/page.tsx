import { basePathname } from './config'
import * as experiments from './e'

export default function Home() {
  return (
    <div className='page'>
      <h1>Home</h1>
      <div className='flex flex-col items-center'>
        {Object.entries(experiments).map(([key, value]) => {
          const { metadata } = value
          const link = `/e/${metadata.slug}`
          return (
            <a key={key} href={basePathname + link}>
              {`${metadata.title}` ?? `exp ${key}`}
            </a>
          )
        })}
      </div>
    </div >
  )
}
