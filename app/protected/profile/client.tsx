"use client";

import { PublicSchemaUser } from "@/app/backend/types/User"; // adjust path
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Item, ItemHeader, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item";

type ProfilePageProps = {
  user: PublicSchemaUser;
};

export default function ProfileClient({ user }: ProfilePageProps) {
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
            <Item size={"sm"} variant={"muted"}>
              <ItemHeader>User ID</ItemHeader>
              <ItemContent>
                <ItemTitle>{user.userId}</ItemTitle>
              </ItemContent>
            </Item>

            <Item size={"sm"} variant={"muted"}>
              <ItemHeader>Username</ItemHeader>
              <ItemContent>
                <ItemTitle>{user.username}</ItemTitle>
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
        </CardContent>
      </Card>
    </div>
  );
}
