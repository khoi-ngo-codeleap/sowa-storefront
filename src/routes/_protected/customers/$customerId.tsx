import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/customers/$customerId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/customers/$customerId"!</div>
}
