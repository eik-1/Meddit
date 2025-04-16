import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const defaultProfileImageUrl =
    "https://res.cloudinary.com/doac8yyie/image/upload/f_auto,q_auto/default";

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 500 }
    );
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_signature = headerPayload.get("svix-signature");
  const svix_timestamp = headerPayload.get("svix-timestamp");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured -- could not verify webhook", {
      status: 400,
    });
  }

  // Get the id and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, username, image_url } = evt.data;
        const primaryEmail = email_addresses?.find(
          (email) => email.id === evt.data.primary_email_address_id
        )?.email_address;

        if (!primaryEmail) {
          console.error("Primary email not found for user:", id);
          return NextResponse.json(
            { error: "Primary email not found" },
            { status: 400 }
          );
        }

        const profileImageUrlToSet = image_url || defaultProfileImageUrl;

        await db
          .insert(users)
          .values({
            id: id,
            email: primaryEmail,
            username: username ?? `user_${id.substring(5)}`,
            profileImageUrl: profileImageUrlToSet,
          })
          .onConflictDoUpdate({
            target: users.id,
            set: {
              email: primaryEmail,
              username: username ?? `user_${id.substring(5)}`,
              profileImageUrl: profileImageUrlToSet,
            },
            // If the user already exists, update the email and username
          });

        console.log(`User ${id} created or updated successfully.`);
        break;
      }
      case "user.deleted": {
        const { id } = evt.data;
        if (!id) {
          console.error("User ID not found in delete event payload.");
          return NextResponse.json(
            { error: "User ID missing for deletion" },
            { status: 400 }
          );
        }
        await db.delete(users).where(eq(users.id, id));
        console.log(`User ${id} deleted successfully.`);
        break;
      }
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json(
      { error: "Internal server error processing webhook" },
      { status: 500 }
    );
  }

  return new Response("", { status: 200 });
}
