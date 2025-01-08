"use server";

import { revalidatePath } from "next/cache";
import Admin from "../database/models/admin.model";
import Record from "../database/models/assignment.model";
import Track from "../database/models/track.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { userInfo } from "./userInfo.action";
import mongoose from "mongoose";
import Task from "../database/models/task.model";
import Application from "../database/models/application.model";

export async function createTrack({
  label,
  trackName,
  trackDescription,
}: {
  label: string;
  trackName: string;
  trackDescription: string;
}) {
  const { userId, userName, userMail } = await userInfo();

  if (!userId || !userName || !userMail) {
    return {
      success: false,
      isAdmin: false,
      message: "Received incomplete user info",
    };
  }

  try {
    await connectToDatabase();

    const admin = await Admin.findOne({
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    if (!admin) {
      return {
        success: false,
        message: "You are not an admin, only admins can create tracks",
      };
    }

    const formattedLabel = label.trim().replace(/\s+/g, "-").toLowerCase();

    const track = await Track.create({
      label: formattedLabel,
      trackName,
      trackDescription,
      createdAt: new Date(),
    });

    if (!track) {
      return {
        success: false,
        message: "Failed to create track",
      };
    }
    revalidatePath("/");
    return {
      success: true,
      message: "Track created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function getTracks() {
  const { userId, userName, userMail } = await userInfo();

  if (!userId || !userName || !userMail) {
    return {
      success: false,
      isAdmin: false,
      message: "Received incomplete user info",
    };
  }

  try {
    await connectToDatabase();

    // Find the user in the database
    const user = await User.findOne({
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    if (!user) {
      return {
        success: false,
        isAdmin: false,
        message: "User not found in the database",
      };
    }

    // Check if the user is an admin
    const admin = await Admin.findOne({
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    let tracks;

    if (admin) {
      // Admin: Fetch all tracks
      const fetchedTracks = await Track.find();
      tracks = fetchedTracks.map((track, index) => ({
        name: track.trackName,
        path: index === 0 ? "/" : `/${track._id}`,
      }));
    } else {
      // Regular User: Fetch tracks linked to their records
      const records = await Record.find({ uid: user._id }).select("trackId");
      const trackIds = records.map((record) => record.trackId);

      const fetchedTracks = await Track.find({ _id: { $in: trackIds } });
      tracks = fetchedTracks.map((track, index) => ({
        name: track.trackName,
        path: index === 0 ? "/" : `/${track._id}`,
      }));
    }

    return {
      success: true,
      isAdmin: !!admin,
      tracks: JSON.parse(JSON.stringify(tracks)),
    };
  } catch (error: any) {
    return {
      success: false,
      isAdmin: false,
      message: error.message || "Something went wrong",
    };
  }
}

// export async function checkAndGetTrack(trackId: string) {
//   if (!mongoose.Types.ObjectId.isValid(trackId)) {
//     return {
//       success: false,
//       message: "Invalid track ID",
//     };
//   }

//   try {
//     const { userId, userName, userMail } = await userInfo();

//     if (!userId || !userName || !userMail) {
//       return {
//         success: false,
//         message: "Received incomplete user info",
//       };
//     }

//     await connectToDatabase();

//     // Check if the user is an admin
//     const isAdmin = await Admin.findOne({
//       clerk_id: userId,
//       email: userMail,
//       username: userName,
//     });

//     let track,
//       tasks = [];

//     if (isAdmin) {
//       // Admin: Fetch track and tasks directly
//       track = await Track.findById(trackId);
//       if (!track) {
//         return {
//           success: false,
//           message: "Track not found",
//         };
//       }

//       tasks = await Task.find({ trackId: track._id }).select(
//         "_id trackId taskName taskDescription deadLine currentDate"
//       );
//     } else {
//       // Non-admin: Fetch track and tasks with additional details
//       const user = await User.findOne({
//         clerk_id: userId,
//         email: userMail,
//         username: userName,
//       });

//       if (!user) {
//         return {
//           success: false,
//           message: "User not found",
//         };
//       }

//       // Check the user's records to find their associated track
//       const record = await Record.findOne({ uid: user._id, trackId: trackId });
//       if (!record) {
//         return {
//           success: false,
//           message: "Track not found in user's records",
//         };
//       }

//       track = await Track.findById(trackId);
//       if (!track) {
//         return {
//           success: false,
//           message: "Track not found",
//         };
//       }

//       const rawTasks = await Task.find({ trackId: track._id }).select(
//         "_id trackId taskName taskDescription deadLine currentDate"
//       );

//       tasks = rawTasks.map((task) => {
//         const taskInfo = record.tasksInfo.find(
//           (info: any) => info.taskId.toString() === task._id.toString()
//         );

//         return {
//           ...task.toObject(),
//           taskStatus: taskInfo?.taskStatus || "in-progress",
//           taskErrorNote: taskInfo?.taskErrorNote || "",
//           taskGitHubUrl: taskInfo?.taskGitHubUrl || "",
//           taskKglUrl: taskInfo?.taskKglUrl || "",
//           taskWebUrl: taskInfo?.taskWebUrl || "",
//         };
//       });
//     }

//     return {
//       success: true,
//       isAdmin: !!isAdmin,
//       track: JSON.parse(JSON.stringify(track)),
//       tasks: JSON.parse(JSON.stringify(tasks)),
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

// export async function checkAndGetTrack(trackId: string) {
//   if (!mongoose.Types.ObjectId.isValid(trackId)) {
//     return {
//       success: false,
//       message: "Invalid track ID",
//     };
//   }
//   try {
//     const { userId, userName, userMail } = await userInfo();

//     if (!userId || !userName || !userMail) {
//       return {
//         success: false,
//         message: "Received incomplete user info",
//       };
//     }

//     await connectToDatabase();

//     // Check if the user is an admin
//     const isAdmin = await Admin.findOne({
//       clerk_id: userId,
//       email: userMail,
//       username: userName,
//     });

//     let track,
//       tasks = [];

//     if (isAdmin) {
//       // If the user is an admin, fetch the track details and all associated tasks
//       track = await Track.findById(trackId);
//       if (!track) {
//         return {
//           success: false,
//           message: "Track not found",
//         };
//       }
//       // Fetch all tasks associated with the track
//       tasks = await Task.find({ trackId: track._id });
//     } else {
//       // If the user is not an admin, check if they have access to the track through their records
//       const user = await User.findOne({
//         clerk_id: userId,
//         email: userMail,
//         username: userName,
//       });

//       if (!user) {
//         return {
//           success: false,
//           message: "User not found",
//         };
//       }

//       // Check the user's records to find their associated track
//       const record = await Record.findOne({ uid: user._id, trackId: trackId });
//       if (!record) {
//         return {
//           success: false,
//           message: "Track not found in user's records",
//         };
//       }

//       // Fetch tasks for the user's associated track
//       track = await Track.findById(trackId);
//       if (track) {
//         tasks = await Task.find({
//           trackId: track._id,
//           "usersWithStatus.userId": user._id,
//         });
//       } else {
//         return {
//           success: false,
//           message: "Track not found",
//         };
//       }
//     }

//     return {
//       success: true,
//       isAdmin: !!isAdmin,
//       track: JSON.parse(JSON.stringify(track)),
//       tasks: JSON.parse(JSON.stringify(tasks)),
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }
export async function checkAndGetTrack(trackId: string) {
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    return {
      success: false,
      message: "Invalid track ID",
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

    await connectToDatabase();

    // Check if the user is an admin
    const isAdmin = await Admin.findOne({
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    const track = await Track.findById(trackId);
    if (!track) {
      return {
        success: false,
        message: "Track not found",
      };
    }

    let tasks = [];
    if (isAdmin) {
      // Admin: Return all tasks associated with the track
      tasks = await Task.find({ trackId: track._id });
    } else {
      // Non-admin: Fetch user's record for the track and include task-specific fields
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

      const record = await Record.findOne({ uid: user._id, trackId: trackId });
      if (!record) {
        return {
          success: false,
          message: "Track not found in user's records",
        };
      }

      const taskIds = record.tasksInfo.map((info: any) => info.taskId);
      const allTasks = await Task.find({ _id: { $in: taskIds } });

      tasks = allTasks.map((task) => {
        const taskInfo = record.tasksInfo.find(
          (info: any) => info.taskId.toString() === task._id.toString()
        );
        return {
          _id: task._id,
          trackId: task.trackId,
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          deadLine: task.deadLine,
          currentDate: task.currentDate,
          taskStatus: taskInfo?.taskStatus || "in-progress",
          taskErrorNote: taskInfo?.taskErrorNote || "",
          taskGitHubUrl: taskInfo?.taskGitHubUrl || "",
          taskKglUrl: taskInfo?.taskKglUrl || "",
          taskWebUrl: taskInfo?.taskWebUrl || "",
        };
      });
    }

    return {
      success: true,
      isAdmin: !!isAdmin,
      track: JSON.parse(JSON.stringify(track)),
      tasks: JSON.parse(JSON.stringify(tasks)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function getRemainingTracks() {
  try {
    const { userId, userName, userMail } = await userInfo();

    if (!userId || !userName || !userMail) {
      return {
        success: false,
        message: "Received incomplete user info",
      };
    }

    await connectToDatabase();

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

    // Find the trackIds that the user is associated with (through their records)
    const userRecords = await Record.find({ uid: user._id }).select("trackId");
    const userTrackIds = userRecords.map((record) => record.trackId);

    // Find the tracks the user has already applied for
    const userApplications = await Application.find({ uid: user._id }).select(
      "trackId"
    );
    const appliedTrackIds = userApplications.map(
      (application) => application.trackId
    );

    // Find all tracks where the user is NOT associated with and has not applied to
    const remainingTracks = await Track.find({
      _id: { $nin: [...userTrackIds, ...appliedTrackIds] }, // Exclude tracks the user is already associated with or has applied to
    }).select("_id trackName trackDescription label");

    return {
      success: true,
      remainingTracks: JSON.parse(JSON.stringify(remainingTracks)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function makeTrackApplicationAndReturnNewData(trackId: string) {
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    return {
      success: false,
      message: "Invalid track ID",
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

    await connectToDatabase();

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

    // Check if the user has already applied to this track
    const existingApplication = await Application.findOne({
      uid: user._id,
      trackId,
    });

    if (existingApplication) {
      return {
        success: false,
        message: "You have already applied for this track",
      };
    }

    // Create a new application
    const newApplication = new Application({
      uid: user._id,
      trackId,
    });

    await newApplication.save();

    // Now fetch the remaining tracks after the application is submitted
    const { success, remainingTracks } = await getRemainingTracks();

    if (!success) {
      return {
        success: false,
        message: "Failed to fetch remaining tracks",
      };
    }

    return {
      success: true,
      message: "Application submitted successfully",
      remainingTracks,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function checkAccesstoTrackAndReturnApplications(trackId: string) {
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    return {
      success: false,
      message: "Invalid track ID",
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

    await connectToDatabase();

    // Check if the user is an admin
    const admin = await Admin.findOne({
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    if (!admin) {
      return {
        success: false,
        message: "You don't have access to this page",
      };
    }

    // Check if the track exists
    const track = await Track.findOne({ _id: trackId }).select(
      "_id trackName trackDescription label"
    );

    if (!track) {
      return {
        success: false,
        message: "Track not found",
      };
    }

    const applications = await Application.find({ trackId })
      .populate("uid", "username email photo first_name last_name")
      .select("uid");

    const applicants = applications.map((application) => application.uid);

    return {
      success: true,
      track: JSON.parse(JSON.stringify(track)),
      applicants: JSON.parse(JSON.stringify(applicants)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function assignTaskToAllTrackMember({
  trackId,
  taskId,
}: {
  trackId: string;
  taskId: string;
}) {
  if (
    !mongoose.Types.ObjectId.isValid(trackId) ||
    !mongoose.Types.ObjectId.isValid(taskId)
  ) {
    return {
      success: false,
      message: "Invalid track ID or task ID",
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

    await connectToDatabase();

    // Check if the user is an admin
    const admin = await Admin.findOne({
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    if (!admin) {
      return {
        success: false,
        message: "You don't have access to this action",
      };
    }

    // Check if the task exists
    const task = await Task.findOne({ _id: taskId, trackId });
    if (!task) {
      return {
        success: false,
        message: "Task not found or doesn't belong to the specified track",
      };
    }

    // Check if the track exists
    const track = await Track.findById(trackId);
    if (!track) {
      return {
        success: false,
        message: "Track not found",
      };
    }

    // Retrieve all records (users) associated with the track
    const records = await Record.find({ trackId }).populate("uid", "_id");

    if (!records.length) {
      return {
        success: false,
        message: "No users found in this track",
      };
    }

    const userIds = records.map((record) => record.uid._id);

    // Update Task's `usersWithStatus` field
    const usersWithStatusUpdates = userIds.map((userId) => ({
      userId,
      status: "in-progress", // Default status
    }));

    await Task.updateOne(
      { _id: taskId },
      { $addToSet: { usersWithStatus: { $each: usersWithStatusUpdates } } }
    );

    // Update Users' Records to include the task
    await Promise.all(
      records.map((record) =>
        Record.updateOne({ _id: record._id }, { $addToSet: { tasks: taskId } })
      )
    );

    return {
      success: true,
      message: "Task successfully assigned to all track members",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
