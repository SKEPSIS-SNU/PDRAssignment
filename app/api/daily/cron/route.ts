import Task from "@/lib/database/models/task.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Check authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    await connectToDatabase();

    const tasks = await Task.find({ expired: false });

    for (const task of tasks) {
      task.currentDate = task.currentDate + 1;

      if (task.currentDate > task.dead_line) {
        task.expired = true;
      }
      await task.save();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cron triggered",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An error occurred while updating tasks.",
      }),
      { status: 500 }
    );
  }
}
