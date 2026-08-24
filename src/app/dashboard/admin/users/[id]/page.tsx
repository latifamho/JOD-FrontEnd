import { UserDetailsPage } from '@/components/pages/users-management'
type Props={params:Promise<{id:string}>}
export default async function AdminUserDetailsRoute({params}:Props){const {id}=await params;return <UserDetailsPage userId={decodeURIComponent(id)}/>}
