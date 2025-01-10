"use server";

import { revalidatePath } from "next/cache";
import Admin from "../database/models/admin.model";
import Track from "../database/models/track.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { userInfo } from "./userInfo.action";
import mongoose from "mongoose";
import Task from "../database/models/task.model";
import Application from "../database/models/application.model";
import Membership from "../database/models/membership.model";
import Assignment from "../database/models/assignment.model";
import Submission from "../database/models/submissions.model";

export async function createTrack({
  trackName,
  trackBanner,
  trackDescription,
}: {
  trackName: string;
  trackBanner: string;
  trackDescription: string;
}) {
  const { clerk_id, user_email } = await userInfo();

  if (!clerk_id || !user_email) {
    return {
      success: false,
      isAdmin: false,
      message: "Received incomplete user info",
    };
  }

  try {
    await connectToDatabase();

    const admin = await Admin.findOne({
      clerk_id,
      email: user_email,
    });

    if (!admin) {
      return {
        success: false,
        message: "You are not an admin, only admins can create tracks",
      };
    }

    const track = await Track.create({
      track_name: trackName,
      banner: trackBanner,
      track_description: trackDescription,
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

export async function getRemainingTracks() {
  try {
    const { clerk_id, user_email } = await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "Received incomplete user info",
      };
    }

    await connectToDatabase();

    // Find the user
    const user = await User.findOne({ clerk_id, email: user_email });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Fetch tracks the user is a member of
    const userMemberships = await Membership.find({ user_id: user._id }).select(
      "track_id"
    );
    const memberTrackIds = userMemberships.map(
      (membership) => membership.track_id
    );

    // Fetch tracks the user has sent applications to
    const userApplications = await Application.find({
      user_id: user._id,
    }).select("track_id");
    const appliedTrackIds = userApplications.map(
      (application) => application.track_id
    );

    // Combine the exclusion list
    const excludedTrackIds = [...memberTrackIds, ...appliedTrackIds];

    // Fetch tracks the user is NOT a member of and has NOT applied to
    const remainingTracks = await Track.find({
      _id: { $nin: excludedTrackIds },
    })
      .select("_id track_name track_description banner")
      .sort({ createdAt: -1 });

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
    const { clerk_id, user_email } = await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "Received incomplete user info",
      };
    }

    await connectToDatabase();

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

    // Check if the user has already applied to this track
    const existingApplication = await Application.findOne({
      user_id: user._id,
      track_id: trackId,
    });

    if (existingApplication) {
      return {
        success: false,
        message: "You have already applied for this track",
      };
    }

    // Create a new application
    const newApplication = Application.create({
      user_id: user._id,
      track_id: trackId,
    });

    if (!newApplication) {
      return {
        success: false,
        message: "Failed to create application",
      };
    }

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

export async function checkAndGetTrack(trackId: string) {
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    return {
      success: false,
      message: "Invalid track ID",
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

    await connectToDatabase();

    // Check if the user is an admin
    const isAdmin = await Admin.findOne({ clerk_id, email: user_email });

    const track = await Track.findById(trackId);
    if (!track) {
      return {
        success: false,
        message: "Track not found",
      };
    }

    let tasks = [];
    let completeCount = 0;
    if (isAdmin) {
      // Fetch all tasks and sort in reverse order by creation date
      tasks = await Task.find({ track_id: track._id }).sort({ createdAt: -1 });
    } else {
      const user = await User.findOne({ clerk_id, email: user_email });

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
          message: "You are not a member of this track",
        };
      }

      // Fetch all tasks in the track and sort in reverse order by creation date
      const trackTasks = await Task.find({ track_id: track._id })
        .sort({ createdAt: -1 }) // Sorting tasks by `createdAt` in descending order
        .select(
          "_id task_name task_description image read_more dead_line currentDate"
        );

      // Fetch assignments for the user
      const assignments = await Assignment.find({
        user_id: user._id,
        task_id: { $in: trackTasks.map((task) => task._id) },
      });

      // Map assignments to tasks
      tasks = trackTasks.map((task) => {
        const assignment = assignments.find(
          (a) => a.task_id.toString() === task._id.toString()
        );
        if (assignment?.status === "completed") {
          ++completeCount; // Increment completeCount for completed tasks
        }
        return {
          ...task.toObject(),
          status: assignment?.status,
          note: assignment?.note,
          error_note: assignment?.error_note,
          is_edited: assignment?.is_edited,
          submission_id: assignment?.submission_id,
        };
      });
    }

    return {
      success: true,
      isAdmin: !!isAdmin,
      track: JSON.parse(JSON.stringify(track)),
      tasks: JSON.parse(JSON.stringify(tasks)),
      completeCount: isAdmin ? 0 : completeCount,
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
    const { clerk_id, user_email } = await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "Received incomplete user info",
      };
    }

    await connectToDatabase();

    // Check if the user is an admin
    const admin = await Admin.findOne({
      clerk_id,
      email: user_email,
    });

    if (!admin) {
      return {
        success: false,
        message: "You don't have access to this page",
      };
    }

    // Check if the track exists
    const track = await Track.findOne({ _id: trackId }).select(
      "_id track_name track_description banner"
    );

    if (!track) {
      return {
        success: false,
        message: "Track not found",
      };
    }

    const applications = await Application.find({ track_id: trackId })
      .populate("user_id", "email photo first_name last_name")
      .select("user_id");

    const applicants = applications.map((application) => application.user_id);

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

type HandleRequestResponse = {
  success: boolean;
  message: string;
};

export async function handleRequest({
  type,
  trackId,
  applicantId,
}: {
  type: "accept" | "reject";
  trackId: string;
  applicantId: string;
}): Promise<HandleRequestResponse> {
  if (
    !mongoose.Types.ObjectId.isValid(trackId) ||
    !mongoose.Types.ObjectId.isValid(applicantId)
  ) {
    return {
      success: false,
      message: "Invalid trackId or applicantId",
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

    await connectToDatabase();

    // Verify the admin's access
    const admin = await Admin.findOne({
      clerk_id,
      email: user_email,
    });

    if (!admin) {
      return {
        success: false,
        message: "You don't have access to this action",
      };
    }

    const track = await Track.findById(trackId);
    if (!track) {
      return {
        success: false,
        message: "Track not found",
      };
    }

    const application = await Application.findOne({
      track_id: trackId,
      user_id: applicantId,
    });
    if (!application) {
      return {
        success: false,
        message: "Application not found",
      };
    }

    let responseMessage = "";

    if (type === "accept") {
      const existingRecord = await Membership.findOne({
        track_id: trackId,
        user_id: applicantId,
      });

      if (existingRecord) {
        return {
          success: false,
          message: "User is already a member of this track",
        };
      }

      const newMembership = await Membership.create({
        track_id: trackId,
        user_id: applicantId,
      });

      if (!newMembership) {
        return {
          success: false,
          message: "Failed to create membership record",
        };
      }

      // Create assignments for all tasks in the track
      const tasks = await Task.find({ track_id: trackId });
      if (tasks.length > 0) {
        const assignments = tasks.map((task) => ({
          user_id: applicantId,
          task_id: task._id,
          track_id: trackId,
        }));

        await Assignment.insertMany(assignments);
      }

      // Remove the application
      await Application.deleteOne({ _id: application._id });

      responseMessage = "Application accepted successfully";
    } else if (type === "reject") {
      await Application.deleteOne({ _id: application._id });

      responseMessage = "Application rejected";
    } else {
      return {
        success: false,
        message: "Invalid request type",
      };
    }

    revalidatePath(`/${trackId}/applications`);

    return {
      success: true,
      message: responseMessage,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function checkAccesstoTrackAndReturnUsers(trackId: string) {
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
        message: "Received incomplete user info",
      };
    }

    await connectToDatabase();

    const track = await Track.findOne({ _id: trackId }).select(
      "_id track_name track_description banner"
    );

    // Verify the admin's access
    const admin = await Admin.findOne({
      clerk_id,
      email: user_email,
    });

    if (!admin) {
      return {
        success: false,
        message: "You don't have access to this action",
      };
    }

    const trackUsers = await Membership.find({ track_id: trackId }).populate(
      "user_id",
      "email photo first_name last_name"
    );

    return {
      success: true,
      trackUsers: JSON.parse(JSON.stringify(trackUsers)),
      track: JSON.parse(JSON.stringify(track)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function removeUserFromTrack(userId: string, trackId: string) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(trackId)
  ) {
    return {
      success: false,
      message: "Invalid userId or trackId",
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

    await connectToDatabase();

    const admin = await Admin.findOne({
      clerk_id,
      email: user_email,
    });

    if (!admin) {
      return {
        success: false,
        message: "You don't have access to this action",
      };
    }

    await Membership.deleteOne({
      track_id: trackId,
      user_id: userId,
    });

    await Submission.deleteMany({
      track_id: trackId,
      user_id: userId,
    });

    await Application.deleteOne({
      track_id: trackId,
      user_id: userId,
    });

    await Assignment.deleteMany({
      track_id: trackId,
      user_id: userId,
    });

    revalidatePath(`/${trackId}/users`);

    return {
      success: true,
      message: "User removed successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
