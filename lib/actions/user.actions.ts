"use server";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import Admin from "../database/models/admin.model";
import { userInfo } from "./userInfo.action";
import Track from "../database/models/track.model";
import Task from "../database/models/task.model";
import Record from "../database/models/assignment.model";
import mongoose from "mongoose";
import Application from "../database/models/application.model";

export type userDataProp = {
  userId: string;
  userName: string;
  userMail: string;
  firstName: string;
  lastName: string;
  userImage: string;
};
export async function handleCreateUserAndReturnData(userData: userDataProp) {
  try {
    await connectToDatabase();

    // Check if the user exists or create a new one
    let user = await User.findOne({
      clerk_id: userData.userId,
      username: userData.userName,
      email: userData.userMail,
    });

    if (!user) {
      user = await User.create({
        clerk_id: userData.userId,
        username: userData.userName,
        email: userData.userMail,
        first_name: userData.firstName,
        last_name: userData.lastName,
        photo: userData.userImage,
        createdAt: new Date(),
        records: [],
      });
    }

    const isAdmin = await Admin.findOne({
      clerk_id: userData.userId,
      email: userData.userMail,
      username: userData.userName,
    });

    let tracks;

    if (isAdmin) {
      // Admin: Get all tracks
      tracks = await Track.find()
        .select("_id trackName trackDescription label")
        .sort({ createdAt: 1 });
    } else {
      // Non-admin user: Fetch only their tracks
      const record = await Record.findOne({ uid: user._id }).sort({
        createdAt: 1,
      });
      if (record) {
        tracks = await Track.find({ _id: record.trackId });
      } else {
        tracks = []; // No records found for the user
      }
    }

    return {
      success: true,
      isAdmin: !!isAdmin,
      tracks: JSON.parse(JSON.stringify(tracks)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function createAdmin({
  clerk_id,
  username,
  email,
}: {
  clerk_id: string;
  username: string;
  email: string;
}) {
  try {
    await connectToDatabase();
    let admin = await Admin.findOne({
      clerk_id,
      username,
      email,
    });

    if (!admin) {
      admin = await Admin.create({
        clerk_id,
        username,
        email,
      });
    }

    return {
      sc: true,
    };
  } catch (error: any) {
    return {
      sc: false,
      m: error.message || "Something went wrong",
    };
  }
}

export async function checkUserIsAdmin() {
  const { userId, userName, userMail } = await userInfo();

  if (!userId || !userName || !userMail) {
    return {
      isAdmin: false,
      message: "Recived incomplete user info",
    };
  }

  try {
    await connectToDatabase();

    const admin = await Admin.findOne({
      clerk_id: userId,
      email: userMail,
      username: userName,
    });

    if (admin) {
      return {
        isAdmin: true,
      };
    }

    return {
      isAdmin: false,
      message: "You dont have access to this page",
    };
  } catch (error: any) {
    return {
      isAdmin: false,
      message: error.message || "Something went wrong",
    };
  }
}

type HandleRequestResponse = {
  success: boolean;
  message: string;
};

// export async function handleRequest({
//   type,
//   trackId,
//   applicantId,
// }: {
//   type: "accept" | "reject";
//   trackId: string;
//   applicantId: string;
// }): Promise<HandleRequestResponse> {
//   if (
//     !mongoose.Types.ObjectId.isValid(trackId) ||
//     !mongoose.Types.ObjectId.isValid(applicantId)
//   ) {
//     return {
//       success: false,
//       message: "Invalid trackId or applicantId",
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

//     // Verify the admin's access
//     const admin = await Admin.findOne({
//       clerk_id: userId,
//       email: userMail,
//       username: userName,
//     });

//     if (!admin) {
//       return {
//         success: false,
//         message: "You don't have access to this action",
//       };
//     }

//     // Check if the track exists
//     const track = await Track.findById(trackId);
//     if (!track) {
//       return {
//         success: false,
//         message: "Track not found",
//       };
//     }

//     // Check if the application exists
//     const application = await Application.findOne({
//       uid: applicantId,
//       trackId,
//     });
//     if (!application) {
//       return {
//         success: false,
//         message: "Application not found",
//       };
//     }

//     if (type === "accept") {
//       const existingRecord = await Record.findOne({
//         uid: applicantId,
//         trackId,
//       });

//       if (existingRecord) {
//         return {
//           success: false,
//           message: "Record already exists for this user and track",
//         };
//       }

//       const newRecord = new Record({
//         uid: applicantId,
//         trackId,
//         tasks: [],
//       });

//       await newRecord.save();

//       // Remove the application
//       await Application.deleteOne({ _id: application._id });

//       return {
//         success: true,
//         message: "Application accepted and record created for the user",
//       };
//     } else if (type === "reject") {
//       // Remove the application
//       await Application.deleteOne({ _id: application._id });

//       return {
//         success: true,
//         message: "Application rejected",
//       };
//     } else {
//       return {
//         success: false,
//         message: "Invalid request type",
//       };
//     }
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

import { revalidatePath } from "next/cache"; // Import revalidatePath

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
    const { userId, userName, userMail } = await userInfo();

    if (!userId || !userName || !userMail) {
      return {
        success: false,
        message: "Received incomplete user info",
      };
    }

    await connectToDatabase();

    // Verify the admin's access
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

    // Check if the track exists
    const track = await Track.findById(trackId);
    if (!track) {
      return {
        success: false,
        message: "Track not found",
      };
    }

    // Check if the application exists
    const application = await Application.findOne({
      uid: applicantId,
      trackId,
    });
    if (!application) {
      return {
        success: false,
        message: "Application not found",
      };
    }

    let responseMessage = "";

    if (type === "accept") {
      const existingRecord = await Record.findOne({
        uid: applicantId,
        trackId,
      });

      if (existingRecord) {
        return {
          success: false,
          message: "Record already exists for this user and track",
        };
      }

      const newRecord = new Record({
        uid: applicantId,
        trackId,
        tasks: [],
      });

      await newRecord.save();

      // Remove the application
      await Application.deleteOne({ _id: application._id });

      responseMessage = "Application accepted and record created for the user";
    } else if (type === "reject") {
      // Remove the application
      await Application.deleteOne({ _id: application._id });

      responseMessage = "Application rejected";
    } else {
      return {
        success: false,
        message: "Invalid request type",
      };
    }

    // Revalidate the path to refresh the cached page
    revalidatePath(`/${trackId}/applications`); // Update the path based on your routing

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
