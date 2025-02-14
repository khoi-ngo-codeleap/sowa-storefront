import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/customers/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/customers/new/"!</div>
}
