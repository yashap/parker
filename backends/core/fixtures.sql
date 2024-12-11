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
-- Name: ParkingSpot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."ParkingSpot" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v1"() NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL,
    "ownerUserId" "uuid" NOT NULL,
    "address" "text" NOT NULL,
    "location" "public"."geometry"(Point,4326) NOT NULL,
    "timeZone" "text" NOT NULL
);


--
-- Name: ParkingSpotBooking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."ParkingSpotBooking" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v1"() NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL,
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
    "id" "uuid" DEFAULT "public"."uuid_generate_v1"() NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL,
    "parkingSpotId" "uuid" NOT NULL,
    "day" "text" NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL
);


--
-- Name: TimeRuleOverride; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."TimeRuleOverride" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v1"() NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL,
    "parkingSpotId" "uuid" NOT NULL,
    "startsAt" timestamp(3) with time zone NOT NULL,
    "endsAt" timestamp(3) with time zone NOT NULL,
    "isAvailable" boolean NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "run_on" timestamp without time zone NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."migrations_id_seq" OWNED BY "public"."migrations"."id";


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
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."migrations_id_seq"'::"regclass");


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
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."migrations" ("id", "name", "run_on") VALUES (1, '/20230825195436-initial-migration', '2024-12-11 09:53:14.371');
INSERT INTO "public"."migrations" ("id", "name", "run_on") VALUES (2, '/20240128005238-add-bookings-table', '2024-12-11 09:53:14.397');
INSERT INTO "public"."migrations" ("id", "name", "run_on") VALUES (3, '/20240902192913-add-parking-spot-time-zone', '2024-12-11 09:53:14.402');
INSERT INTO "public"."migrations" ("id", "name", "run_on") VALUES (4, '/20240907175122-add-time-rule-override copy', '2024-12-11 09:53:14.407');


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
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."migrations_id_seq"', 4, true);


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
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");


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
-- Name: ParkingSpotBooking ParkingSpotBooking_parkingSpotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ParkingSpotBooking"
    ADD CONSTRAINT "ParkingSpotBooking_parkingSpotId_fkey" FOREIGN KEY ("parkingSpotId") REFERENCES "public"."ParkingSpot"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ParkingSpotBooking ParkingSpotBooking_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ParkingSpotBooking"
    ADD CONSTRAINT "ParkingSpotBooking_status_fkey" FOREIGN KEY ("status") REFERENCES "public"."values_ParkingSpotBooking_status"("status");


--
-- Name: TimeRuleOverride TimeRuleOverride_parkingSpotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TimeRuleOverride"
    ADD CONSTRAINT "TimeRuleOverride_parkingSpotId_fkey" FOREIGN KEY ("parkingSpotId") REFERENCES "public"."ParkingSpot"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TimeRule TimeRule_day_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TimeRule"
    ADD CONSTRAINT "TimeRule_day_fkey" FOREIGN KEY ("day") REFERENCES "public"."values_TimeRule_day"("day");


--
-- Name: TimeRule TimeRule_parkingSpotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TimeRule"
    ADD CONSTRAINT "TimeRule_parkingSpotId_fkey" FOREIGN KEY ("parkingSpotId") REFERENCES "public"."ParkingSpot"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA "public" TO "core";


--
-- Name: TABLE "ParkingSpot"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."ParkingSpot" TO "core" WITH GRANT OPTION;


--
-- Name: TABLE "ParkingSpotBooking"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."ParkingSpotBooking" TO "core" WITH GRANT OPTION;


--
-- Name: TABLE "TimeRule"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."TimeRule" TO "core" WITH GRANT OPTION;


--
-- Name: TABLE "TimeRuleOverride"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."TimeRuleOverride" TO "core" WITH GRANT OPTION;


--
-- Name: TABLE "migrations"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."migrations" TO "core" WITH GRANT OPTION;


--
-- Name: TABLE "values_ParkingSpotBooking_status"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."values_ParkingSpotBooking_status" TO "core" WITH GRANT OPTION;


--
-- Name: TABLE "values_TimeRule_day"; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE "public"."values_TimeRule_day" TO "core" WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE "dev_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "core" WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

