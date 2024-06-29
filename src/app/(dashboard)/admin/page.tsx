import { authOptions } from '../../../lib/auth'
import { getServerSession } from 'next-auth'

export default async function page() {
  const session = await getServerSession(authOptions)

  if(session?.user) {
    return (
      <h2 className='text-2xl'>Admin page - welcome back {session?.user.username}</h2>
    )
  } else {
    return (
      <h2 className='text-2xl'>Admin page - please sign in</h2>
    )
  }
}

