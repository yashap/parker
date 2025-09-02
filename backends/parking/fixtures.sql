--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Debian 15.2-1.pgdg110+1)
-- Dumped by pg_dump version 15.2 (Debian 15.2-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "drizzle";


--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";


--
-- Name: EXTENSION "postgis"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "postgis" IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";


--
-- Name: ParkingSpot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."ParkingSpot" (
    "id" "uuid" NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "ownerUserId" "uuid" NOT NULL,
    "address" "text" NOT NULL,
    "location" "public"."geometry"(Point,4326) NOT NULL,
    "timeZone" "text" NOT NULL
);


--
-- Name: ParkingSpotBooking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."ParkingSpotBooking" (
    "id" "uuid" NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "parkingSpotId" "uuid" NOT NULL,
    "bookedByUserId" "uuid" NOT NULL,
    "bookingStartsAt" timestamp(3) with time zone NOT NULL,
    "bookingEndsAt" timestamp(3) with time zone,
    "status" "text" NOT NULL
);


--
-- Name: TimeRule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."TimeRule" (
    "id" "uuid" NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "parkingSpotId" "uuid" NOT NULL,
    "day" "text" NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL
);


--
-- Name: TimeRuleOverride; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."TimeRuleOverride" (
    "id" "uuid" NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "parkingSpotId" "uuid" NOT NULL,
    "startsAt" timestamp(3) with time zone NOT NULL,
    "endsAt" timestamp(3) with time zone NOT NULL,
    "isAvailable" boolean NOT NULL
);


--
-- Name: values_ParkingSpotBooking_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."values_ParkingSpotBooking_status" (
    "status" "text" NOT NULL
);


--
-- Name: values_TimeRule_day; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."values_TimeRule_day" (
    "day" "text" NOT NULL
);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

INSERT INTO "drizzle"."__drizzle_migrations" ("id", "hash", "created_at") VALUES (1, '0f1c6d7e9c45ef066f435bffab9a9f8ef643263f6360ce2f6c80ffb0a18cd840', 1734241205561);
INSERT INTO "drizzle"."__drizzle_migrations" ("id", "hash", "created_at") VALUES (2, '836a0a52fbac6ef5d16d2d5633527b5a5d4abd60465e7fdb5d7dad9d7bfba70e', 1734241221849);
INSERT INTO "drizzle"."__drizzle_migrations" ("id", "hash", "created_at") VALUES (3, 'ec6f7febe232fc5ff2bcc31af13364ff7c4c6948f282de75cdd4fef4be052ab9', 1734241249810);


--
-- Data for Name: ParkingSpot; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ParkingSpotBooking; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: TimeRule; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: TimeRuleOverride; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: values_ParkingSpotBooking_status; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."values_ParkingSpotBooking_status" ("status") VALUES ('Accepted');
INSERT INTO "public"."values_ParkingSpotBooking_status" ("status") VALUES ('InProgress');
INSERT INTO "public"."values_ParkingSpotBooking_status" ("status") VALUES ('Cancelled');


--
-- Data for Name: values_TimeRule_day; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."values_TimeRule_day" ("day") VALUES ('Monday');
INSERT INTO "public"."values_TimeRule_day" ("day") VALUES ('Tuesday');
INSERT INTO "public"."values_TimeRule_day" ("day") VALUES ('Wednesday');
INSERT INTO "public"."values_TimeRule_day" ("day") VALUES ('Thursday');
INSERT INTO "public"."values_TimeRule_day" ("day") VALUES ('Friday');
INSERT INTO "public"."values_TimeRule_day" ("day") VALUES ('Saturday');
INSERT INTO "public"."values_TimeRule_day" ("day") VALUES ('Sunday');


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('"drizzle"."__drizzle_migrations_id_seq"', 3, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");


--
-- Name: ParkingSpotBooking ParkingSpotBooking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ParkingSpotBooking"
    ADD CONSTRAINT "ParkingSpotBooking_pkey" PRIMARY KEY ("id");


--
-- Name: ParkingSpot ParkingSpot_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ParkingSpot"
    ADD CONSTRAINT "ParkingSpot_pkey" PRIMARY KEY ("id");


--
-- Name: TimeRuleOverride TimeRuleOverride_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TimeRuleOverride"
    ADD CONSTRAINT "TimeRuleOverride_pkey" PRIMARY KEY ("id");


--
-- Name: TimeRule TimeRule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TimeRule"
    ADD CONSTRAINT "TimeRule_pkey" PRIMARY KEY ("id");


--
-- Name: values_ParkingSpotBooking_status values_ParkingSpotBooking_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."values_ParkingSpotBooking_status"
    ADD CONSTRAINT "values_ParkingSpotBooking_status_pkey" PRIMARY KEY ("status");


--
-- Name: values_TimeRule_day values_TimeRule_day_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."values_TimeRule_day"
    ADD CONSTRAINT "values_TimeRule_day_pkey" PRIMARY KEY ("day");


--
-- Name: ParkingSpotBooking_bookedByUserId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ParkingSpotBooking_bookedByUserId_idx" ON "public"."ParkingSpotBooking" USING "btree" ("bookedByUserId");


--
-- Name: ParkingSpotBooking_parkingSpotId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ParkingSpotBooking_parkingSpotId_idx" ON "public"."ParkingSpotBooking" USING "btree" ("parkingSpotId");


--
-- Name: ParkingSpot_location_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ParkingSpot_location_idx" ON "public"."ParkingSpot" USING "gist" ("location");


--
-- Name: ParkingSpot_ownerUserId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ParkingSpot_ownerUserId_idx" ON "public"."ParkingSpot" USING "btree" ("ownerUserId");


--
-- Name: TimeRuleOverride_parkingSpotId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TimeRuleOverride_parkingSpotId_idx" ON "public"."TimeRuleOverride" USING "btree" ("parkingSpotId");


--
-- Name: TimeRule_parkingSpotId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TimeRule_parkingSpotId_idx" ON "public"."TimeRule" USING "btree" ("parkingSpotId");


--
-- Name: ParkingSpotBooking ParkingSpotBooking_parkingSpotId_ParkingSpot_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ParkingSpotBooking"
    ADD CONSTRAINT "ParkingSpotBooking_parkingSpotId_ParkingSpot_id_fk" FOREIGN KEY ("parkingSpotId") REFERENCES "public"."ParkingSpot"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ParkingSpotBooking ParkingSpotBooking_status_values_ParkingSpotBooking_status_stat; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ParkingSpotBooking"
    ADD CONSTRAINT "ParkingSpotBooking_status_values_ParkingSpotBooking_status_stat" FOREIGN KEY ("status") REFERENCES "public"."values_ParkingSpotBooking_status"("status");


--
-- Name: TimeRuleOverride TimeRuleOverride_parkingSpotId_ParkingSpot_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TimeRuleOverride"
    ADD CONSTRAINT "TimeRuleOverride_parkingSpotId_ParkingSpot_id_fk" FOREIGN KEY ("parkingSpotId") REFERENCES "public"."ParkingSpot"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TimeRule TimeRule_day_values_TimeRule_day_day_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TimeRule"
    ADD CONSTRAINT "TimeRule_day_values_TimeRule_day_day_fk" FOREIGN KEY ("day") REFERENCES "public"."values_TimeRule_day"("day");


--
-- Name: TimeRule TimeRule_parkingSpotId_ParkingSpot_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TimeRule"
    ADD CONSTRAINT "TimeRule_parkingSpotId_ParkingSpot_id_fk" FOREIGN KEY ("parkingSpotId") REFERENCES "public"."ParkingSpot"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA "public" TO "parking";


--
-- Name: TABLE "ParkingSpot"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."ParkingSpot" TO "parking" WITH GRANT OPTION;


--
-- Name: TABLE "ParkingSpotBooking"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."ParkingSpotBooking" TO "parking" WITH GRANT OPTION;


--
-- Name: TABLE "TimeRule"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."TimeRule" TO "parking" WITH GRANT OPTION;


--
-- Name: TABLE "TimeRuleOverride"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."TimeRuleOverride" TO "parking" WITH GRANT OPTION;


--
-- Name: TABLE "values_ParkingSpotBooking_status"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."values_ParkingSpotBooking_status" TO "parking" WITH GRANT OPTION;


--
-- Name: TABLE "values_TimeRule_day"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."values_TimeRule_day" TO "parking" WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE "dev_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "parking" WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

