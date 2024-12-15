CREATE TABLE "FavouriteLocation" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" text NOT NULL,
	"location" GEOMETRY(POINT,4326) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Post" (
	"id" serial PRIMARY KEY NOT NULL,
	"authorId" integer NOT NULL,
	"message" text NOT NULL,
	"sentAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Reminder" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"description" text NOT NULL,
	"time" TIME WITHOUT TIME ZONE NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "FavouriteLocation" ADD CONSTRAINT "FavouriteLocation_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_User_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;