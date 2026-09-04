import { OrganizationHelpRequestDetailsPage } from '@/components/pages/organization-help'
export default async function Page({ params }:{ params: Promise<{id:string}> }){ const {id}=await params; return <OrganizationHelpRequestDetailsPage id={id} /> }
