"use server";

import { currentUser } from "@clerk/nextjs/server";

export async function userInfo() {
  try {
    const user = await currentUser();
    return {
      clerk_id: user?.id || "",
      user_email: user?.emailAddresses[0].emailAddress || "",
      user_image: user?.imageUrl || "",
      first_name: user?.firstName || "",
      last_name: user?.lastName || "",
    };
  } catch (error: any) {
    return {
      clerk_id: "",
      user_email: "",
      user_image: "",
      first_name: "",
      last_name: "",
    };
  }
}
