CREATE TABLE "values_ParkingSpotBooking_status" (
	"status" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "values_TimeRule_day" (
	"day" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ParkingSpotBooking" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v1() NOT NULL,
	"createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"parkingSpotId" uuid NOT NULL,
	"bookedByUserId" uuid NOT NULL,
	"bookingStartsAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"bookingEndsAt" TIMESTAMP(3) WITH TIME ZONE,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ParkingSpot" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v1() NOT NULL,
	"createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"ownerUserId" uuid NOT NULL,
	"address" text NOT NULL,
	"location" GEOMETRY(POINT,4326) NOT NULL,
	"timeZone" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TimeRuleOverride" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v1() NOT NULL,
	"createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"parkingSpotId" uuid NOT NULL,
	"startsAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"endsAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"isAvailable" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TimeRule" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v1() NOT NULL,
	"createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
	"parkingSpotId" uuid NOT NULL,
	"day" text NOT NULL,
	"startTime" TIME WITHOUT TIME ZONE NOT NULL,
	"endTime" TIME WITHOUT TIME ZONE NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ParkingSpotBooking" ADD CONSTRAINT "ParkingSpotBooking_parkingSpotId_ParkingSpot_id_fk" FOREIGN KEY ("parkingSpotId") REFERENCES "public"."ParkingSpot"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ParkingSpotBooking" ADD CONSTRAINT "ParkingSpotBooking_status_values_ParkingSpotBooking_status_status_fk" FOREIGN KEY ("status") REFERENCES "public"."values_ParkingSpotBooking_status"("status") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TimeRuleOverride" ADD CONSTRAINT "TimeRuleOverride_parkingSpotId_ParkingSpot_id_fk" FOREIGN KEY ("parkingSpotId") REFERENCES "public"."ParkingSpot"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TimeRule" ADD CONSTRAINT "TimeRule_parkingSpotId_ParkingSpot_id_fk" FOREIGN KEY ("parkingSpotId") REFERENCES "public"."ParkingSpot"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TimeRule" ADD CONSTRAINT "TimeRule_day_values_TimeRule_day_day_fk" FOREIGN KEY ("day") REFERENCES "public"."values_TimeRule_day"("day") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ParkingSpotBooking_bookedByUserId_idx" ON "ParkingSpotBooking" USING btree ("bookedByUserId");--> statement-breakpoint
CREATE INDEX "ParkingSpotBooking_parkingSpotId_idx" ON "ParkingSpotBooking" USING btree ("parkingSpotId");--> statement-breakpoint
CREATE INDEX "ParkingSpot_ownerUserId_idx" ON "ParkingSpot" USING btree ("ownerUserId");--> statement-breakpoint
CREATE INDEX "ParkingSpot_location_idx" ON "ParkingSpot" USING gist ("location");--> statement-breakpoint
CREATE INDEX "TimeRuleOverride_parkingSpotId_idx" ON "TimeRuleOverride" USING btree ("parkingSpotId");--> statement-breakpoint
CREATE INDEX "TimeRule_parkingSpotId_idx" ON "TimeRule" USING btree ("parkingSpotId");