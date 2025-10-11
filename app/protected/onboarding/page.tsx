
import React, { Suspense } from "react";
import OnboardingPageClient from "./client";
import { redirect } from "next/navigation";
import { checkOnboarded } from "@/app/backend/redirects/checkOnboarded";
import { getAuthUser } from "@/app/backend/redirects/checkUser";
import FinsightLoadingLogo from "@/app/blocks/finsightLoadingLogo";


export default async function OnboardingPage() {
  const user = await getAuthUser();
  console.log("user: ", user)
  const response = await checkOnboarded();
  if (response.data){
    return redirect("/protected/home");
  }

  return(
    <>
      <Suspense fallback={<FinsightLoadingLogo/>}>
        <OnboardingPageClient userId={user.id} email={user.email ?? ""}/>
      </Suspense>
    </>
  )
}