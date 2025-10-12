"use client";

import { PublicSchemaUser } from "@/app/backend/types/User"; // adjust path
import { CurrencyDropdown } from "@/app/blocks/forms/currencyDropdown";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Item, ItemHeader, ItemContent, ItemTitle } from "@/components/ui/item";

type ProfilePageProps = {
  user: PublicSchemaUser;
};

export default function ProfileClient({ user }: ProfilePageProps) {

  const handleUpdateCurerncy = async (newCurrency: number) => {

  }
  
  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-3xl shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Profile Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Item size="sm" variant="muted">
              <ItemHeader>Currency</ItemHeader>
              <ItemContent>
                <CurrencyDropdown
                  initialCurrencyId={user.currency}
                  onCurrencyChange={(newCurrency) => {
                    handleUpdateCurerncy(newCurrency)
                  }}
                />
              </ItemContent>
            </Item>


            <Item size={"sm"} variant={"muted"}>
              <ItemHeader>Username</ItemHeader>
              <ItemContent>
                <ItemTitle>{user.username}</ItemTitle>
              </ItemContent>
            </Item>

            <Item size={"sm"} variant={"muted"}>
              <ItemHeader>Email</ItemHeader>
              <ItemContent>
                <ItemTitle>{user.email}</ItemTitle>
              </ItemContent>
            </Item>

            <Item size={"sm"} variant={"muted"}>
              <ItemHeader>First Name</ItemHeader>
              <ItemContent>
                <ItemTitle>{user.firstName}</ItemTitle>
              </ItemContent>
            </Item>

            <Item size={"sm"} variant={"muted"}>
              <ItemHeader>Last Name</ItemHeader>
              <ItemContent>
                <ItemTitle>{user.lastName}</ItemTitle>
              </ItemContent>
            </Item>

            <Item size={"sm"} variant={"muted"}>
              <ItemHeader>Age</ItemHeader>
              <ItemContent>
                <ItemTitle>{user.age}</ItemTitle>
              </ItemContent>
            </Item>

            <Item size={"sm"} variant={"muted"}>
              <ItemHeader>Created At</ItemHeader>
              <ItemContent>
                <ItemTitle>{new Date(user.createdAt).toDateString()}</ItemTitle>
              </ItemContent>
            </Item>
          </div>
          <div className="flex justify-center mt-4">
            <LogoutButton/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
