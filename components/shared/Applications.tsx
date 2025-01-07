"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "../ui/skeleton";
import AcceptOrReject from "./AcceptOrReject";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const Applications = ({
  applicants,
  trackId,
}: {
  applicants: any[];
  trackId: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter applicants based on the search term
  const filteredApplicants = applicants.filter(
    (applicant) =>
      `${applicant.first_name} ${applicant.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex flex-col gap-4 mt-4">
      <div className="self-end w-full md:w-fit relative">
        <Search className="absolute w-4 h-4 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          className="py-5 pr-5 pl-9 rounded-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Applicants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApplicants.map((applicant: any) => (
          <div
            key={applicant._id}
            className="flex flex-row gap-4 p-6 border rounded-2xl flex-wrap"
          >
            <Avatar className="w-16 h-16">
              <AvatarImage
                draggable={false}
                className="select-none"
                src={applicant.photo}
              />
              <AvatarFallback>
                <Skeleton className="h-full w-full rounded-full bg-primary/50 animate-pulse" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold">
                {applicant.first_name} {applicant.last_name}
              </p>
              <p className="text-muted-foreground text-sm">{applicant.email}</p>
              <AcceptOrReject applicantId={applicant._id} trackId={trackId} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Applications;
