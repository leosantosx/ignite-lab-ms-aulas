import { getSession, useUser } from '@auth0/nextjs-auth0'
import type { GetServerSideProps } from 'next'

export default function Home() {
  const { user } = useUser()

  return (
    <div>
      <h1>Hello</h1>
      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>
      <a href="/api/auth/login">Login</a>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res)

  if(!session){
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: true
      },
    }
  } else {
    
    return {
      redirect: {
        destination: '/app',
        permanent: true
      }
    } 
  }
}
