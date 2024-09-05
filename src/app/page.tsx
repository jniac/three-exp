import * as experiments from './exp'

export default function Home() {
  return (
    <div className='fullsize center flex-col'>
      <h1>Home</h1>
      <div className='flex flex-col'>
        {Object.entries(experiments).map(([key, value]) => {
          const link = `/exp/${key.slice(3)}`
          return (
            <a key={key} href={link}>
              {link}
            </a>
          )
        })}
      </div>
    </div >
  )
}
