
import { redirect } from 'next/navigation'

export default function ProtectedPage() {
  return redirect("/protected/home")
}