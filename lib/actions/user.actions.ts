"use server";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import Admin from "../database/models/admin.model";
import { userInfo } from "./userInfo.action";
import Track from "../database/models/track.model";
import Membership from "../database/models/membership.model";

export async function handleCreateUserAndReturnData() {
  try {
    const { clerk_id, first_name, last_name, user_email, user_image } =
      await userInfo();

    if (!clerk_id || !user_email) {
      return {
        success: false,
        message: "Received incomplete user info",
      };
    }

    await connectToDatabase();

    let user = await User.findOne({ clerk_id, email: user_email });

    if (!user) {
      user = await User.create({
        clerk_id,
        email: user_email,
        first_name,
        last_name,
        photo: user_image,
      });
    }

    const isAdmin = await Admin.findOne({ clerk_id, email: user_email });

    let tracks = [];

    if (isAdmin) {
      // Admin: Get all tracks
      tracks = await Track.find()
        .select("_id track_name track_description banner")
        .sort({ createdAt: -1 });
    } else {
      // Regular user: Get tracks from the Membership table
      const memberships = await Membership.find({ user_id: user._id }).select(
        "track_id"
      );

      const trackIds = memberships.map((membership) => membership.track_id);

      tracks = await Track.find({ _id: { $in: trackIds } })
        .select("_id track_name track_description banner")
        .sort({ createdAt: -1 });
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
