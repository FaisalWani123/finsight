
import { redirect } from "next/navigation";
import { getAuthUser } from "../backend/redirects/checkUser"
import { checkOnboarded } from "../backend/redirects/checkOnboarded";
import OnboardingPageClient from "./onboarding/client";
import MobileNav from "../blocks/nav/mobileNav";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const user = await getAuthUser(); 
  if(!user || user === undefined){

    return redirect("/auth/login");
  }

  const isOnboardedResponse = await checkOnboarded(); 
  if(!isOnboardedResponse.success){
    return <OnboardingPageClient userId={user.id} email={user.email ?? ""}/>
  }
  
  return (
    <>
      <MobileNav/>
        <main className="p-1 w-full">
            {children}
        </main>
    </>
  )
}