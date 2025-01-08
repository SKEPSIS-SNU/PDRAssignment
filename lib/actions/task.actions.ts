"use server";

import mongoose from "mongoose";
import { userInfo } from "./userInfo.action";
import Admin from "../database/models/admin.model";
import Task from "../database/models/task.model";
import { revalidatePath } from "next/cache";
import Record from "../database/models/assignment.model";
import { connectToDatabase } from "../database/mongoose";
import Track from "../database/models/track.model";
import User from "../database/models/user.model";
import Submission from "../database/models/submissions.model";

export async function createTask({
  trackId,
  taskName,
  taskDescription,
}: {
  trackId: string;
  taskName: string;
  taskDescription: string;
}) {
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    return {
      success: false,
      message: "Invalid trackId",
    };
  }

  try {
    const { userId, userName, userMail } = await userInfo();

    if (!userId || !userName || !userMail) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const isAdmin = await Admin.findOne({
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    if (!isAdmin) {
      return {
        success: false,
        message: "You are not an admin",
      };
    }

    // Create the task
    const task = await Task.create({
      trackId,
      taskName,
      taskDescription,
      deadLine: 7, // Default deadline
      currentDate: 0, // Default current day
    });

    if (!task) {
      return {
        success: false,
        message: "Task not created",
      };
    }

    // Update all user records associated with the track
    const records = await Record.find({ trackId });

    for (const record of records) {
      // Check if the task already exists in the record
      const taskExists = record.tasksInfo.some(
        (taskInfo: any) => taskInfo.taskId.toString() === task._id.toString()
      );

      if (!taskExists) {
        // Add the new task to the tasksInfo array
        record.tasksInfo.push({
          taskId: task._id,
          taskStatus: "in-progress",
          taskErrorNote: "",
          submissionId: null,
          taskGitHubUrl: "",
          taskKglUrl: "",
          taskWebUrl: "",
        });
        await record.save(); // Save the updated record
      }
    }

    // Revalidate paths
    revalidatePath(`/`);
    revalidatePath(`/${trackId}`);

    return {
      success: true,
      message: "Task created and records updated successfully",
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
    const { userId, userName, userMail } = await userInfo();

    if (!userId || !userName || !userMail) {
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
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Create a new submission
    const submission = await Submission.create({
      uid: user._id,
      trackId,
      taskId,
    });

    if (!submission) {
      return {
        success: false,
        message: "Failed to create submission",
      };
    }

    // Update user's record for the task
    const recordUpdateResult = await Record.updateOne(
      { uid: user._id, trackId, "tasksInfo.taskId": taskId },
      {
        $set: {
          "tasksInfo.$.taskStatus": "review",
          "tasksInfo.$.submissionId": submission._id,
          "tasksInfo.$.taskGitHubUrl": gitHubLink,
          "tasksInfo.$.taskKglUrl": kglLink,
          "tasksInfo.$.taskWebUrl": webLink,
        },
      }
    );

    if (recordUpdateResult.modifiedCount === 0) {
      return {
        success: false,
        message: "Failed to update user record",
      };
    }
    revalidatePath(`/${trackId}`);
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

// export async function checkAccToSubmissionsAndReturnSubmissions(
//   trackId: string,
//   taskId: string
// ) {
//   if (
//     !mongoose.Types.ObjectId.isValid(trackId) ||
//     !mongoose.Types.ObjectId.isValid(taskId)
//   ) {
//     return {
//       success: false,
//       message: "Invalid trackId or taskId",
//     };
//   }

//   try {
//     const { userId, userName, userMail } = await userInfo();

//     if (!userId || !userName || !userMail) {
//       return {
//         success: false,
//         message: "User not found",
//       };
//     }

//     await connectToDatabase();

//     const track = await Track.findById(trackId);
//     if (!track) {
//       return {
//         success: false,
//         message: "Track not found",
//       };
//     }

//     const task = await Task.findById(taskId);
//     if (!task) {
//       return {
//         success: false,
//         message: "Task not found",
//       };
//     }

//     const isAdmin = await Admin.findOne({
//       clerk_id: userId,
//       email: userMail,
//       username: userName,
//     });

//     if (!isAdmin) {
//       return {
//         success: false,
//         message: "You don't have access to this page",
//       };
//     }

//     // Fetch all submissions for the given track and task
//     const submissions = await Submission.find({ trackId, taskId }).populate({
//       path: "uid",
//       select: "photo username email first_name last_name",
//     });

//     // Fetch task details
//     const taskDetails = {
//       taskName: task.taskName,
//       taskDescription: task.taskDescription,
//       deadLine: task.deadLine, // deadLine as a number
//     };

//     // Map submissions to include required fields
//     const submissionDetails = await Promise.all(
//       submissions.map(async (submission) => {
//         const record = await Record.findOne({
//           uid: submission.uid._id,
//           trackId,
//           "tasksInfo.taskId": taskId,
//         });

//         return {
//           submissionId: submission._id.toString(), // Adding the submissionId field
//           uid: submission.uid._id.toString(),
//           photo: submission.uid.photo,
//           username: submission.uid.username,
//           email: submission.uid.email,
//           first_name: submission.uid.first_name,
//           last_name: submission.uid.last_name,
//           trackId: submission.trackId.toString(),
//           taskId: submission.taskId.toString(),
//           taskName: taskDetails.taskName,
//           taskDescription: taskDetails.taskDescription,
//           deadLine: taskDetails.deadLine, // deadLine is a number
//           taskGitHubUrl:
//             record?.tasksInfo?.find((t: any) => t.taskId.toString() === taskId)
//               ?.taskGitHubUrl || "",
//           taskKglUrl:
//             record?.tasksInfo?.find((t: any) => t.taskId.toString() === taskId)
//               ?.taskKglUrl || "",
//           taskWebUrl:
//             record?.tasksInfo?.find((t: any) => t.taskId.toString() === taskId)
//               ?.taskWebUrl || "",
//         };
//       })
//     );

//     return {
//       success: true,
//       submissions: submissionDetails,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

export async function checkAccToSubmissionsAndReturnSubmissions(
  trackId: string,
  taskId: string
) {
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
    const { userId, userName, userMail } = await userInfo();

    if (!userId || !userName || !userMail) {
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
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    if (!isAdmin) {
      return {
        success: false,
        message: "You don't have access to this page",
      };
    }

    // Fetch all submissions for the given track and task
    const submissions = await Submission.find({ trackId, taskId }).populate({
      path: "uid",
      select: "photo username email first_name last_name",
    });

    // Map submissions to include required fields
    const submissionDetails = await Promise.all(
      submissions.map(async (submission) => {
        const record = await Record.findOne({
          uid: submission.uid._id,
          trackId,
          "tasksInfo.taskId": taskId,
        });

        return {
          submissionId: submission._id.toString(),
          uid: submission.uid._id.toString(),
          photo: submission.uid.photo,
          username: submission.uid.username,
          email: submission.uid.email,
          first_name: submission.uid.first_name,
          last_name: submission.uid.last_name,
          trackId: submission.trackId.toString(),
          taskId: submission.taskId.toString(),
          taskGitHubUrl:
            record?.tasksInfo?.find((t: any) => t.taskId.toString() === taskId)
              ?.taskGitHubUrl || "",
          taskKglUrl:
            record?.tasksInfo?.find((t: any) => t.taskId.toString() === taskId)
              ?.taskKglUrl || "",
          taskWebUrl:
            record?.tasksInfo?.find((t: any) => t.taskId.toString() === taskId)
              ?.taskWebUrl || "",
        };
      })
    );

    // Return the response in the desired format
    return {
      success: true,
      trackName: track.trackName, // Assuming track model has this field
      trackDescription: track.trackDescription, // Assuming track model has this field
      taskName: task.taskName,
      taskDescription: task.taskDescription,
      submissions: submissionDetails,
    };
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
    const { userId, userName, userMail } = await userInfo();

    if (!userId || !userName || !userMail) {
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
        clerk_id: userId,
        email: userMail,
        username: userName,
      });

      if (!isAdmin) {
        return {
          success: false,
          message: "You don't have access to this action",
        };
      }

      // Handle "accept" action
      if (type === "accept") {
        const record = await Record.findOne({
          uid: submission.uid._id,
          trackId: submission.trackId,
          "tasksInfo.taskId": submission.taskId,
        });

        if (record) {
          record.tasksInfo = record.tasksInfo.map((task: any) =>
            task.taskId.toString() === submission.taskId.toString()
              ? { ...task, taskStatus: "completed", submissionId: null }
              : task
          );
          await record.save();
        }

        await Submission.findByIdAndDelete(submissionId);

        revalidatePath(
          `/${submission.trackId}/${submission.taskId}/submissions`
        );

        return {
          success: true,
          message: "Submission accepted successfully",
        };
      } else if (type === "reject") {
        const record = await Record.findOne({
          uid: submission.uid._id,
          trackId: submission.trackId,
          "tasksInfo.taskId": submission.taskId,
        });

        if (record) {
          record.tasksInfo = record.tasksInfo.map((task: any) =>
            task.taskId.toString() === submission.taskId.toString()
              ? { ...task, taskStatus: "in-progress", submissionId: null }
              : task
          );
          await record.save();
        }

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

  // Add a default return for safety
  return {
    success: false,
    message: "An unexpected error occurred",
  };
}
