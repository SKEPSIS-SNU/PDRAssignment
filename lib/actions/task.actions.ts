"use server";

import mongoose from "mongoose";
import { userInfo } from "./userInfo.action";
import Admin from "../database/models/admin.model";
import Task from "../database/models/task.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import Track from "../database/models/track.model";
import User from "../database/models/user.model";
import Submission from "../database/models/submissions.model";
import Membership from "../database/models/membership.model";
import Assignment from "../database/models/assignment.model";
import { UTApi } from "uploadthing/server";

type createTaskProps = {
  trackId: string;
  taskName: string;
  taskDescription: string;
  readMore: string;
  image: string;
  deadLine: number;
};

export async function createTask({
  trackId,
  taskName,
  taskDescription,
  readMore,
  image,
  deadLine,
}: createTaskProps) {
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    return {
      success: false,
      message: "Invalid trackId",
    };
  }

  try {
    const { clerk_id, user_email } = await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await connectToDatabase();

    // Check if the user is an admin
    const isAdmin = await Admin.findOne({
      clerk_id,
      email: user_email,
    });

    if (!isAdmin) {
      return {
        success: false,
        message: "You are not an admin",
      };
    }

    // Create the task
    const task = await Task.create({
      track_id: trackId,
      task_name: taskName,
      task_description: taskDescription,
      read_more: readMore,
      image,
      dead_line: deadLine,
    });

    if (!task) {
      return {
        success: false,
        message: "Task not created",
      };
    }

    // Fetch all members of the track
    const members = await Membership.find({ track_id: trackId });
    if (members.length > 0) {
      const assignments = members.map((member) => ({
        user_id: member.user_id,
        task_id: task._id,
        track_id: trackId,
      }));

      const createdAssignments = await Assignment.insertMany(assignments);

      if (createdAssignments.length !== members.length) {
        return {
          success: false,
          message: "Failed to create assignments for all members",
        };
      }
    }

    // Revalidate paths
    revalidatePath(`/`);
    revalidatePath(`/${trackId}`);

    return {
      success: true,
      message: "Task created and assignments generated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
type updateTaskProps = {
  taskId: string;
  trackId: string;
  taskName: string;
  taskDescription: string;
  readMore: string;
  image: string;
  additionalDays: number;
};
export async function updateTask({
  taskId,
  trackId,
  taskName,
  taskDescription,
  readMore,
  image,
  additionalDays,
}: updateTaskProps) {
  if (
    !mongoose.Types.ObjectId.isValid(taskId) ||
    !mongoose.Types.ObjectId.isValid(trackId)
  ) {
    return {
      success: false,
      message: "Invalid taskId or trackId",
    };
  }
  try {
    const { clerk_id, user_email } = await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ clerk_id, email: user_email });

    if (!admin) {
      return {
        success: false,
        message: "You are not an admin",
      };
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    task.task_name = taskName;
    task.task_description = taskDescription;
    task.read_more = readMore;
    task.dead_line += additionalDays;

    if (task.image === "") {
      task.image = image;
    } else {
      let oldImageKey = task.image.split("/").pop();
      try {
        const utapi = new UTApi();
        await utapi.deleteFiles(oldImageKey);
      } catch (error: any) {
        return {
          success: false,
          message: "Failed to delete old image: " + error.message,
        };
      }
      task.image = image;
    }

    const updatedTask = await task.save();

    if (!updatedTask) {
      return {
        success: false,
        message: "Task not updated",
      };
    }

    // Revalidate paths
    revalidatePath(`/${trackId}`);

    return {
      success: true,
      message: "Task updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function deleteTask(taskId: string, trackId: string) {
  if (
    !mongoose.Types.ObjectId.isValid(taskId) ||
    !mongoose.Types.ObjectId.isValid(trackId)
  ) {
    return {
      success: false,
      message: "Invalid taskId or trackId",
    };
  }
  try {
    const { clerk_id, user_email } = await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ clerk_id, email: user_email });

    if (!admin) {
      return {
        success: false,
        message: "You dont have permission to delete task",
      };
    }

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    //remove image from uploadthing
    if (task.image !== "") {
      let oldImageKey = task.image.split("/").pop();
      try {
        const utapi = new UTApi();
        await utapi.deleteFiles(oldImageKey);
      } catch (error: any) {
        return {
          success: false,
          message: "Failed to delete old image: " + error.message,
        };
      }
    }

    await Assignment.deleteMany({ task_id: taskId });
    await Submission.deleteMany({ task_id: taskId });

    // Revalidate paths
    revalidatePath(`/${trackId}`);

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function submitTask({
  trackId,
  taskId,
  gitHubLink,
  kglLink,
  webLink,
}: {
  trackId: string;
  taskId: string;
  gitHubLink: string;
  kglLink: string;
  webLink: string;
}) {
  if (
    !mongoose.Types.ObjectId.isValid(trackId) ||
    !mongoose.Types.ObjectId.isValid(taskId)
  ) {
    return {
      success: false,
      message: "Invalid trackId or taskId",
    };
  }

  try {
    const { clerk_id, user_email } = await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await connectToDatabase();

    const track = await Track.findById(trackId);
    if (!track) {
      return {
        success: false,
        message: "Track not found",
      };
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    const user = await User.findOne({
      clerk_id,
      email: user_email,
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Create a new submission
    const submission = await Submission.create({
      user_id: user._id,
      track_id: trackId,
      task_id: taskId,
    });

    if (!submission) {
      return {
        success: false,
        message: "Failed to create submission",
      };
    }

    const assignment = await Assignment.findOneAndUpdate(
      { user_id: user._id, task_id: taskId },
      {
        status: "review",
        submission_id: submission._id,
        github_link: gitHubLink,
        kaggle_link: kglLink,
        website_link: webLink,
      }
    );

    if (!assignment) {
      await Submission.findByIdAndDelete(submission._id);
      return {
        success: false,
        message: "Failed to submit assignment",
      };
    }

    revalidatePath(`/${trackId}`);
    revalidatePath(`/${trackId}/${taskId}`);
    return {
      success: true,
      message: "Task submitted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function checkAndGetTrackAndTask(trackId: string, taskId: string) {
  if (
    !mongoose.Types.ObjectId.isValid(trackId) ||
    !mongoose.Types.ObjectId.isValid(taskId)
  ) {
    return {
      success: false,
      message: "Invalid trackId or taskId",
    };
  }
  try {
    const { clerk_id, user_email } = await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await connectToDatabase();

    const track = await Track.findById(trackId);
    if (!track) {
      return {
        success: false,
        message: "Track not found",
      };
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    const isAdmin = await Admin.findOne({
      clerk_id,
      email: user_email,
    });

    if (isAdmin) {
      const submissions = await Assignment.find({
        task_id: taskId,
        status: "review",
      }).populate({
        path: "user_id",
        select: "_id first_name last_name photo email", // Select only the fields you need
      });

      return {
        success: true,
        isAdmin: true,
        track: JSON.parse(JSON.stringify(track)),
        task: JSON.parse(JSON.stringify(task)),
        submissions: JSON.parse(JSON.stringify(submissions)),
      };
    } else {
      const user = await User.findOne({
        clerk_id,
        email: user_email,
      });

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }
      const membership = await Membership.findOne({
        user_id: user._id,
        track_id: trackId,
      });

      if (!membership) {
        return {
          success: false,
          message: "You don't have access to this page",
        };
      }

      const assignment = await Assignment.findOne({
        user_id: user._id,
        task_id: taskId,
      });

      if (!assignment) {
        return {
          success: false,
          message: "You don't have access to this page",
        };
      }

      return {
        success: true,
        isAdmin: false,
        track: JSON.parse(JSON.stringify(track)),
        task: JSON.parse(JSON.stringify(task)),
        assignment: JSON.parse(JSON.stringify(assignment)),
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function handleSubmissionAcceptOrReject(
  submissionId: string,
  type: "accept" | "reject"
): Promise<{ success: boolean; message: string }> {
  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    return {
      success: false,
      message: "Invalid submission ID",
    };
  }

  try {
    const { clerk_id, user_email } = await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "Received incomplete user info",
      };
    }

    try {
      await connectToDatabase();

      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return {
          success: false,
          message: "Submission not found",
        };
      }

      const isAdmin = await Admin.findOne({
        clerk_id,
        email: user_email,
      });

      if (!isAdmin) {
        return {
          success: false,
          message: "You don't have access to this action",
        };
      }

      // Handle "accept" action
      if (type === "accept") {
        const submission = await Submission.findById(submissionId);

        await Assignment.findOneAndUpdate(
          { submission_id: submissionId },
          {
            status: "completed",
            note: "Submission accepted by admin",
            submission_id: null,
          }
        );

        await Submission.findByIdAndDelete(submissionId);

        revalidatePath(
          `/${submission.trackId}/${submission.taskId}/submissions`
        );

        return {
          success: true,
          message: "Submission accepted successfully",
        };
      } else if (type === "reject") {
        const submission = await Submission.findById(submissionId);

        await Assignment.findOneAndUpdate(
          { submission_id: submissionId },
          {
            status: "in-progress",
            submission_id: null,
            error_note: "Submission rejected by admin",
            github_link: "",
            kaggle_link: "",
            website_link: "",
          }
        );

        await Submission.findByIdAndDelete(submissionId);

        revalidatePath(
          `/${submission.trackId}/${submission.taskId}/submissions`
        );

        return {
          success: true,
          message: "Submission rejected successfully",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to authenticate user",
    };
  }

  return {
    success: false,
    message: "An unexpected error occurred",
  };
}
