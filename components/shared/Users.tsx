"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import RemoveUser from "./RemoveUser";

const Users = ({ users, trackId }: { users: any[]; trackId: string }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      `${user.user_id.first_name} ${user.user_id.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.user_id.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex flex-col gap-4 mt-4">
      <div className="self-end w-full md:w-fit relative">
        <Search className="absolute w-4 h-4 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          className="pr-5 pl-9 rounded-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user: any) => (
          <div key={user.user_id._id} className="p-6 border rounded-xl">
            <div className="flex flex-row gap-4 flex-wrap">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  draggable={false}
                  className="select-none"
                  src={user.user_id.photo}
                />
                <AvatarFallback>
                  <Skeleton className="h-full w-full rounded-full bg-primary/50 animate-pulse" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-bold">
                  {user.user_id.first_name} {user.user_id.last_name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {user.user_id.email}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <RemoveUser userId={user.user_id._id} trackId={trackId} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Users;
