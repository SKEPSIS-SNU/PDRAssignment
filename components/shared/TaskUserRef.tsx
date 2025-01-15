"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "../ui/skeleton";
import AccRejSubRenderer from "./AccRejSubRenderer";
import TaskLink from "./TaskLink";
import { Input } from "../ui/input";

const TaskUserRef = ({
  users,
  type,
}: {
  users: any[];
  type: "submissions" | "pending" | "completed";
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on the search term
  const filteredUsers = users.filter((submission) => {
    const { first_name, last_name, email } = submission.user_id;
    const fullName = `${first_name} ${last_name}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      {users.length > 0 ? (
        <>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((submission: any) => (
                <div
                  key={submission.user_id._id}
                  className="p-6 flex flex-col gap-6 border rounded-2xl"
                >
                  <div className="flex gap-4 items-start flex-row flex-wrap">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={submission.user_id.photo} />
                      <AvatarFallback>
                        <Skeleton className="h-full w-full rounded-full bg-primary/50 animate-pulse" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">
                        {submission.user_id.first_name}{" "}
                        {submission.user_id.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {submission.user_id.email}
                      </p>
                    </div>
                  </div>
                  {type === "submissions" && (
                    <>
                      <div className="flex flex-col gap-2">
                        {submission.github_link && (
                          <TaskLink
                            linkType="Github"
                            link={submission.github_link}
                          />
                        )}

                        {submission.kaggle_link && (
                          <TaskLink
                            linkType="Kaggel"
                            link={submission.kaggle_link}
                          />
                        )}

                        {submission.website_link && (
                          <TaskLink
                            linkType="Website"
                            link={submission.website_link}
                          />
                        )}
                      </div>
                      <AccRejSubRenderer
                        submissionId={submission.submission_id}
                      />
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No submissions match your search
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">Nothing to show</p>
      )}
    </>
  );
};

export default TaskUserRef;
