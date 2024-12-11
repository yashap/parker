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


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: all_auth_recipe_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."all_auth_recipe_users" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character(36) NOT NULL,
    "primary_or_recipe_user_id" character(36) NOT NULL,
    "is_linked_or_is_a_primary_user" boolean DEFAULT false NOT NULL,
    "recipe_id" character varying(128) NOT NULL,
    "time_joined" bigint NOT NULL,
    "primary_or_recipe_user_time_joined" bigint NOT NULL
);


--
-- Name: app_id_to_user_id; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."app_id_to_user_id" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character(36) NOT NULL,
    "recipe_id" character varying(128) NOT NULL,
    "primary_or_recipe_user_id" character(36) NOT NULL,
    "is_linked_or_is_a_primary_user" boolean DEFAULT false NOT NULL
);


--
-- Name: apps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."apps" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "created_at_time" bigint
);


--
-- Name: dashboard_user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."dashboard_user_sessions" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "session_id" character(36) NOT NULL,
    "user_id" character(36) NOT NULL,
    "time_created" bigint NOT NULL,
    "expiry" bigint NOT NULL
);


--
-- Name: dashboard_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."dashboard_users" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character(36) NOT NULL,
    "email" character varying(256) NOT NULL,
    "password_hash" character varying(256) NOT NULL,
    "time_joined" bigint NOT NULL
);


--
-- Name: emailpassword_pswd_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."emailpassword_pswd_reset_tokens" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character(36) NOT NULL,
    "token" character varying(128) NOT NULL,
    "email" character varying(256),
    "token_expiry" bigint NOT NULL
);


--
-- Name: emailpassword_user_to_tenant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."emailpassword_user_to_tenant" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character(36) NOT NULL,
    "email" character varying(256) NOT NULL
);


--
-- Name: emailpassword_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."emailpassword_users" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character(36) NOT NULL,
    "email" character varying(256) NOT NULL,
    "password_hash" character varying(256) NOT NULL,
    "time_joined" bigint NOT NULL
);


--
-- Name: emailverification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."emailverification_tokens" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character varying(128) NOT NULL,
    "email" character varying(256) NOT NULL,
    "token" character varying(128) NOT NULL,
    "token_expiry" bigint NOT NULL
);


--
-- Name: emailverification_verified_emails; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."emailverification_verified_emails" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character varying(128) NOT NULL,
    "email" character varying(256) NOT NULL
);


--
-- Name: jwt_signing_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."jwt_signing_keys" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "key_id" character varying(255) NOT NULL,
    "key_string" "text" NOT NULL,
    "algorithm" character varying(10) NOT NULL,
    "created_at" bigint
);


--
-- Name: key_value; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."key_value" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "name" character varying(128) NOT NULL,
    "value" "text",
    "created_at_time" bigint
);


--
-- Name: passwordless_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."passwordless_codes" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "code_id" character(36) NOT NULL,
    "device_id_hash" character(44) NOT NULL,
    "link_code_hash" character(44) NOT NULL,
    "created_at" bigint NOT NULL
);


--
-- Name: passwordless_devices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."passwordless_devices" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "device_id_hash" character(44) NOT NULL,
    "email" character varying(256),
    "phone_number" character varying(256),
    "link_code_salt" character(44) NOT NULL,
    "failed_attempts" integer NOT NULL
);


--
-- Name: passwordless_user_to_tenant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."passwordless_user_to_tenant" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character(36) NOT NULL,
    "email" character varying(256),
    "phone_number" character varying(256)
);


--
-- Name: passwordless_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."passwordless_users" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character(36) NOT NULL,
    "email" character varying(256),
    "phone_number" character varying(256),
    "time_joined" bigint NOT NULL
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."role_permissions" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "role" character varying(255) NOT NULL,
    "permission" character varying(255) NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."roles" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "role" character varying(255) NOT NULL
);


--
-- Name: session_access_token_signing_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."session_access_token_signing_keys" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "created_at_time" bigint NOT NULL,
    "value" "text"
);


--
-- Name: session_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."session_info" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "session_handle" character varying(255) NOT NULL,
    "user_id" character varying(128) NOT NULL,
    "refresh_token_hash_2" character varying(128) NOT NULL,
    "session_data" "text",
    "expires_at" bigint NOT NULL,
    "created_at_time" bigint NOT NULL,
    "jwt_user_payload" "text",
    "use_static_key" boolean NOT NULL
);


--
-- Name: tenant_configs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."tenant_configs" (
    "connection_uri_domain" character varying(256) DEFAULT ''::character varying NOT NULL,
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "core_config" "text",
    "email_password_enabled" boolean,
    "passwordless_enabled" boolean,
    "third_party_enabled" boolean,
    "is_first_factors_null" boolean
);


--
-- Name: tenant_first_factors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."tenant_first_factors" (
    "connection_uri_domain" character varying(256) DEFAULT ''::character varying NOT NULL,
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "factor_id" character varying(128) NOT NULL
);


--
-- Name: tenant_required_secondary_factors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."tenant_required_secondary_factors" (
    "connection_uri_domain" character varying(256) DEFAULT ''::character varying NOT NULL,
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "factor_id" character varying(128) NOT NULL
);


--
-- Name: tenant_thirdparty_provider_clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."tenant_thirdparty_provider_clients" (
    "connection_uri_domain" character varying(256) DEFAULT ''::character varying NOT NULL,
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "third_party_id" character varying(28) NOT NULL,
    "client_type" character varying(64) DEFAULT ''::character varying NOT NULL,
    "client_id" character varying(256) NOT NULL,
    "client_secret" "text",
    "scope" character varying(128)[],
    "force_pkce" boolean,
    "additional_config" "text"
);


--
-- Name: tenant_thirdparty_providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."tenant_thirdparty_providers" (
    "connection_uri_domain" character varying(256) DEFAULT ''::character varying NOT NULL,
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "third_party_id" character varying(28) NOT NULL,
    "name" character varying(64),
    "authorization_endpoint" "text",
    "authorization_endpoint_query_params" "text",
    "token_endpoint" "text",
    "token_endpoint_body_params" "text",
    "user_info_endpoint" "text",
    "user_info_endpoint_query_params" "text",
    "user_info_endpoint_headers" "text",
    "jwks_uri" "text",
    "oidc_discovery_endpoint" "text",
    "require_email" boolean,
    "user_info_map_from_id_token_payload_user_id" character varying(64),
    "user_info_map_from_id_token_payload_email" character varying(64),
    "user_info_map_from_id_token_payload_email_verified" character varying(64),
    "user_info_map_from_user_info_endpoint_user_id" character varying(64),
    "user_info_map_from_user_info_endpoint_email" character varying(64),
    "user_info_map_from_user_info_endpoint_email_verified" character varying(64)
);


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."tenants" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "created_at_time" bigint
);


--
-- Name: thirdparty_user_to_tenant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."thirdparty_user_to_tenant" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character(36) NOT NULL,
    "third_party_id" character varying(28) NOT NULL,
    "third_party_user_id" character varying(256) NOT NULL
);


--
-- Name: thirdparty_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."thirdparty_users" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "third_party_id" character varying(28) NOT NULL,
    "third_party_user_id" character varying(256) NOT NULL,
    "user_id" character(36) NOT NULL,
    "email" character varying(256) NOT NULL,
    "time_joined" bigint NOT NULL
);


--
-- Name: totp_used_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."totp_used_codes" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character varying(128) NOT NULL,
    "code" character varying(8) NOT NULL,
    "is_valid" boolean NOT NULL,
    "expiry_time_ms" bigint NOT NULL,
    "created_time_ms" bigint NOT NULL
);


--
-- Name: totp_user_devices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."totp_user_devices" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character varying(128) NOT NULL,
    "device_name" character varying(256) NOT NULL,
    "secret_key" character varying(256) NOT NULL,
    "period" integer NOT NULL,
    "skew" integer NOT NULL,
    "verified" boolean NOT NULL,
    "created_at" bigint
);


--
-- Name: totp_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."totp_users" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character varying(128) NOT NULL
);


--
-- Name: user_last_active; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."user_last_active" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character varying(128) NOT NULL,
    "last_active_time" bigint
);


--
-- Name: user_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."user_metadata" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character varying(128) NOT NULL,
    "user_metadata" "text" NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."user_roles" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "tenant_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "user_id" character varying(128) NOT NULL,
    "role" character varying(255) NOT NULL
);


--
-- Name: userid_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."userid_mapping" (
    "app_id" character varying(64) DEFAULT 'public'::character varying NOT NULL,
    "supertokens_user_id" character(36) NOT NULL,
    "external_user_id" character varying(128) NOT NULL,
    "external_user_id_info" "text"
);


--
-- Data for Name: all_auth_recipe_users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: app_id_to_user_id; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: apps; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."apps" ("app_id", "created_at_time") VALUES ('public', 1733939654338);


--
-- Data for Name: dashboard_user_sessions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: dashboard_users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: emailpassword_pswd_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: emailpassword_user_to_tenant; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: emailpassword_users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: emailverification_tokens; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: emailverification_verified_emails; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: jwt_signing_keys; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."jwt_signing_keys" ("app_id", "key_id", "key_string", "algorithm", "created_at") VALUES ('public', 's-200ee1e5-82be-47ec-aa13-4efbd857e910', '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', 'RS256', 1733939654620);


--
-- Data for Name: key_value; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."key_value" ("app_id", "tenant_id", "name", "value", "created_at_time") VALUES ('public', 'public', 'FEATURE_FLAG', '[]', 1733939654355);
INSERT INTO "public"."key_value" ("app_id", "tenant_id", "name", "value", "created_at_time") VALUES ('public', 'public', 'refresh_token_key', '1000:9cabd16bdd0654bb1e356bf90b9d942076d4d0419129fa98e18d5f6131f3c9071dc62468a0e24d6400df9a1882e7b936b8b0a7c4ec60786ca8ad03acbfe10057:8a10b52386270b8fcc6edfc2ead8cc04a6385959c7e209a83dac131240dc91426e1c819ffcf457b44c0e691edd7f1258d75b2c2f7d920485535cb6d902682b0a', 1733939654613);
INSERT INTO "public"."key_value" ("app_id", "tenant_id", "name", "value", "created_at_time") VALUES ('public', 'public', 'TELEMETRY_ID', '67658adb-bc71-48e7-8291-f613ac40fa8f', 1733939654697);


--
-- Data for Name: passwordless_codes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: passwordless_devices; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: passwordless_user_to_tenant; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: passwordless_users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: session_access_token_signing_keys; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."session_access_token_signing_keys" ("app_id", "created_at_time", "value") VALUES ('public', 1733939654585, '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');


--
-- Data for Name: session_info; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: tenant_configs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."tenant_configs" ("connection_uri_domain", "app_id", "tenant_id", "core_config", "email_password_enabled", "passwordless_enabled", "third_party_enabled", "is_first_factors_null") VALUES ('', 'public', 'public', '{}', true, true, true, true);


--
-- Data for Name: tenant_first_factors; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: tenant_required_secondary_factors; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: tenant_thirdparty_provider_clients; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: tenant_thirdparty_providers; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."tenants" ("app_id", "tenant_id", "created_at_time") VALUES ('public', 'public', 1733939654338);


--
-- Data for Name: thirdparty_user_to_tenant; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: thirdparty_users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: totp_used_codes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: totp_user_devices; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: totp_users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: user_last_active; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: user_metadata; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: userid_mapping; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: all_auth_recipe_users all_auth_recipe_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."all_auth_recipe_users"
    ADD CONSTRAINT "all_auth_recipe_users_pkey" PRIMARY KEY ("app_id", "tenant_id", "user_id");


--
-- Name: app_id_to_user_id app_id_to_user_id_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."app_id_to_user_id"
    ADD CONSTRAINT "app_id_to_user_id_pkey" PRIMARY KEY ("app_id", "user_id");


--
-- Name: apps apps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."apps"
    ADD CONSTRAINT "apps_pkey" PRIMARY KEY ("app_id");


--
-- Name: dashboard_user_sessions dashboard_user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."dashboard_user_sessions"
    ADD CONSTRAINT "dashboard_user_sessions_pkey" PRIMARY KEY ("app_id", "session_id");


--
-- Name: dashboard_users dashboard_users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."dashboard_users"
    ADD CONSTRAINT "dashboard_users_email_key" UNIQUE ("app_id", "email");


--
-- Name: dashboard_users dashboard_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."dashboard_users"
    ADD CONSTRAINT "dashboard_users_pkey" PRIMARY KEY ("app_id", "user_id");


--
-- Name: emailpassword_pswd_reset_tokens emailpassword_pswd_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailpassword_pswd_reset_tokens"
    ADD CONSTRAINT "emailpassword_pswd_reset_tokens_pkey" PRIMARY KEY ("app_id", "user_id", "token");


--
-- Name: emailpassword_pswd_reset_tokens emailpassword_pswd_reset_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailpassword_pswd_reset_tokens"
    ADD CONSTRAINT "emailpassword_pswd_reset_tokens_token_key" UNIQUE ("token");


--
-- Name: emailpassword_user_to_tenant emailpassword_user_to_tenant_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailpassword_user_to_tenant"
    ADD CONSTRAINT "emailpassword_user_to_tenant_email_key" UNIQUE ("app_id", "tenant_id", "email");


--
-- Name: emailpassword_user_to_tenant emailpassword_user_to_tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailpassword_user_to_tenant"
    ADD CONSTRAINT "emailpassword_user_to_tenant_pkey" PRIMARY KEY ("app_id", "tenant_id", "user_id");


--
-- Name: emailpassword_users emailpassword_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailpassword_users"
    ADD CONSTRAINT "emailpassword_users_pkey" PRIMARY KEY ("app_id", "user_id");


--
-- Name: emailverification_tokens emailverification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailverification_tokens"
    ADD CONSTRAINT "emailverification_tokens_pkey" PRIMARY KEY ("app_id", "tenant_id", "user_id", "email", "token");


--
-- Name: emailverification_tokens emailverification_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailverification_tokens"
    ADD CONSTRAINT "emailverification_tokens_token_key" UNIQUE ("token");


--
-- Name: emailverification_verified_emails emailverification_verified_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailverification_verified_emails"
    ADD CONSTRAINT "emailverification_verified_emails_pkey" PRIMARY KEY ("app_id", "user_id", "email");


--
-- Name: jwt_signing_keys jwt_signing_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."jwt_signing_keys"
    ADD CONSTRAINT "jwt_signing_keys_pkey" PRIMARY KEY ("app_id", "key_id");


--
-- Name: key_value key_value_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."key_value"
    ADD CONSTRAINT "key_value_pkey" PRIMARY KEY ("app_id", "tenant_id", "name");


--
-- Name: passwordless_codes passwordless_codes_link_code_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_codes"
    ADD CONSTRAINT "passwordless_codes_link_code_hash_key" UNIQUE ("app_id", "tenant_id", "link_code_hash");


--
-- Name: passwordless_codes passwordless_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_codes"
    ADD CONSTRAINT "passwordless_codes_pkey" PRIMARY KEY ("app_id", "tenant_id", "code_id");


--
-- Name: passwordless_devices passwordless_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_devices"
    ADD CONSTRAINT "passwordless_devices_pkey" PRIMARY KEY ("app_id", "tenant_id", "device_id_hash");


--
-- Name: passwordless_user_to_tenant passwordless_user_to_tenant_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_user_to_tenant"
    ADD CONSTRAINT "passwordless_user_to_tenant_email_key" UNIQUE ("app_id", "tenant_id", "email");


--
-- Name: passwordless_user_to_tenant passwordless_user_to_tenant_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_user_to_tenant"
    ADD CONSTRAINT "passwordless_user_to_tenant_phone_number_key" UNIQUE ("app_id", "tenant_id", "phone_number");


--
-- Name: passwordless_user_to_tenant passwordless_user_to_tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_user_to_tenant"
    ADD CONSTRAINT "passwordless_user_to_tenant_pkey" PRIMARY KEY ("app_id", "tenant_id", "user_id");


--
-- Name: passwordless_users passwordless_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_users"
    ADD CONSTRAINT "passwordless_users_pkey" PRIMARY KEY ("app_id", "user_id");


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("app_id", "role", "permission");


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("app_id", "role");


--
-- Name: session_access_token_signing_keys session_access_token_signing_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_access_token_signing_keys"
    ADD CONSTRAINT "session_access_token_signing_keys_pkey" PRIMARY KEY ("app_id", "created_at_time");


--
-- Name: session_info session_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_info"
    ADD CONSTRAINT "session_info_pkey" PRIMARY KEY ("app_id", "tenant_id", "session_handle");


--
-- Name: tenant_configs tenant_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenant_configs"
    ADD CONSTRAINT "tenant_configs_pkey" PRIMARY KEY ("connection_uri_domain", "app_id", "tenant_id");


--
-- Name: tenant_first_factors tenant_first_factors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenant_first_factors"
    ADD CONSTRAINT "tenant_first_factors_pkey" PRIMARY KEY ("connection_uri_domain", "app_id", "tenant_id", "factor_id");


--
-- Name: tenant_required_secondary_factors tenant_required_secondary_factors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenant_required_secondary_factors"
    ADD CONSTRAINT "tenant_required_secondary_factors_pkey" PRIMARY KEY ("connection_uri_domain", "app_id", "tenant_id", "factor_id");


--
-- Name: tenant_thirdparty_provider_clients tenant_thirdparty_provider_clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenant_thirdparty_provider_clients"
    ADD CONSTRAINT "tenant_thirdparty_provider_clients_pkey" PRIMARY KEY ("connection_uri_domain", "app_id", "tenant_id", "third_party_id", "client_type");


--
-- Name: tenant_thirdparty_providers tenant_thirdparty_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenant_thirdparty_providers"
    ADD CONSTRAINT "tenant_thirdparty_providers_pkey" PRIMARY KEY ("connection_uri_domain", "app_id", "tenant_id", "third_party_id");


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("app_id", "tenant_id");


--
-- Name: thirdparty_user_to_tenant thirdparty_user_to_tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."thirdparty_user_to_tenant"
    ADD CONSTRAINT "thirdparty_user_to_tenant_pkey" PRIMARY KEY ("app_id", "tenant_id", "user_id");


--
-- Name: thirdparty_user_to_tenant thirdparty_user_to_tenant_third_party_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."thirdparty_user_to_tenant"
    ADD CONSTRAINT "thirdparty_user_to_tenant_third_party_user_id_key" UNIQUE ("app_id", "tenant_id", "third_party_id", "third_party_user_id");


--
-- Name: thirdparty_users thirdparty_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."thirdparty_users"
    ADD CONSTRAINT "thirdparty_users_pkey" PRIMARY KEY ("app_id", "user_id");


--
-- Name: totp_used_codes totp_used_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."totp_used_codes"
    ADD CONSTRAINT "totp_used_codes_pkey" PRIMARY KEY ("app_id", "tenant_id", "user_id", "created_time_ms");


--
-- Name: totp_user_devices totp_user_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."totp_user_devices"
    ADD CONSTRAINT "totp_user_devices_pkey" PRIMARY KEY ("app_id", "user_id", "device_name");


--
-- Name: totp_users totp_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."totp_users"
    ADD CONSTRAINT "totp_users_pkey" PRIMARY KEY ("app_id", "user_id");


--
-- Name: user_last_active user_last_active_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_last_active"
    ADD CONSTRAINT "user_last_active_pkey" PRIMARY KEY ("app_id", "user_id");


--
-- Name: user_metadata user_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_metadata"
    ADD CONSTRAINT "user_metadata_pkey" PRIMARY KEY ("app_id", "user_id");


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("app_id", "tenant_id", "user_id", "role");


--
-- Name: userid_mapping userid_mapping_external_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."userid_mapping"
    ADD CONSTRAINT "userid_mapping_external_user_id_key" UNIQUE ("app_id", "external_user_id");


--
-- Name: userid_mapping userid_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."userid_mapping"
    ADD CONSTRAINT "userid_mapping_pkey" PRIMARY KEY ("app_id", "supertokens_user_id", "external_user_id");


--
-- Name: userid_mapping userid_mapping_supertokens_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."userid_mapping"
    ADD CONSTRAINT "userid_mapping_supertokens_user_id_key" UNIQUE ("app_id", "supertokens_user_id");


--
-- Name: access_token_signing_keys_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "access_token_signing_keys_app_id_index" ON "public"."session_access_token_signing_keys" USING "btree" ("app_id");


--
-- Name: all_auth_recipe_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "all_auth_recipe_tenant_id_index" ON "public"."all_auth_recipe_users" USING "btree" ("app_id", "tenant_id");


--
-- Name: all_auth_recipe_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "all_auth_recipe_user_id_index" ON "public"."all_auth_recipe_users" USING "btree" ("app_id", "user_id");


--
-- Name: all_auth_recipe_users_pagination_index1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "all_auth_recipe_users_pagination_index1" ON "public"."all_auth_recipe_users" USING "btree" ("app_id", "tenant_id", "primary_or_recipe_user_time_joined" DESC, "primary_or_recipe_user_id" DESC);


--
-- Name: all_auth_recipe_users_pagination_index2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "all_auth_recipe_users_pagination_index2" ON "public"."all_auth_recipe_users" USING "btree" ("app_id", "tenant_id", "primary_or_recipe_user_time_joined", "primary_or_recipe_user_id" DESC);


--
-- Name: all_auth_recipe_users_pagination_index3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "all_auth_recipe_users_pagination_index3" ON "public"."all_auth_recipe_users" USING "btree" ("recipe_id", "app_id", "tenant_id", "primary_or_recipe_user_time_joined" DESC, "primary_or_recipe_user_id" DESC);


--
-- Name: all_auth_recipe_users_pagination_index4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "all_auth_recipe_users_pagination_index4" ON "public"."all_auth_recipe_users" USING "btree" ("recipe_id", "app_id", "tenant_id", "primary_or_recipe_user_time_joined", "primary_or_recipe_user_id" DESC);


--
-- Name: all_auth_recipe_users_primary_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "all_auth_recipe_users_primary_user_id_index" ON "public"."all_auth_recipe_users" USING "btree" ("primary_or_recipe_user_id", "app_id");


--
-- Name: all_auth_recipe_users_recipe_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "all_auth_recipe_users_recipe_id_index" ON "public"."all_auth_recipe_users" USING "btree" ("app_id", "recipe_id", "tenant_id");


--
-- Name: app_id_to_user_id_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "app_id_to_user_id_app_id_index" ON "public"."app_id_to_user_id" USING "btree" ("app_id");


--
-- Name: app_id_to_user_id_primary_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "app_id_to_user_id_primary_user_id_index" ON "public"."app_id_to_user_id" USING "btree" ("primary_or_recipe_user_id", "app_id");


--
-- Name: dashboard_user_sessions_expiry_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "dashboard_user_sessions_expiry_index" ON "public"."dashboard_user_sessions" USING "btree" ("expiry");


--
-- Name: dashboard_user_sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "dashboard_user_sessions_user_id_index" ON "public"."dashboard_user_sessions" USING "btree" ("app_id", "user_id");


--
-- Name: dashboard_users_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "dashboard_users_app_id_index" ON "public"."dashboard_users" USING "btree" ("app_id");


--
-- Name: emailpassword_password_reset_token_expiry_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "emailpassword_password_reset_token_expiry_index" ON "public"."emailpassword_pswd_reset_tokens" USING "btree" ("token_expiry");


--
-- Name: emailpassword_pswd_reset_tokens_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "emailpassword_pswd_reset_tokens_user_id_index" ON "public"."emailpassword_pswd_reset_tokens" USING "btree" ("app_id", "user_id");


--
-- Name: emailverification_tokens_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "emailverification_tokens_index" ON "public"."emailverification_tokens" USING "btree" ("token_expiry");


--
-- Name: emailverification_tokens_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "emailverification_tokens_tenant_id_index" ON "public"."emailverification_tokens" USING "btree" ("app_id", "tenant_id");


--
-- Name: emailverification_verified_emails_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "emailverification_verified_emails_app_id_index" ON "public"."emailverification_verified_emails" USING "btree" ("app_id");


--
-- Name: jwt_signing_keys_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "jwt_signing_keys_app_id_index" ON "public"."jwt_signing_keys" USING "btree" ("app_id");


--
-- Name: key_value_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "key_value_tenant_id_index" ON "public"."key_value" USING "btree" ("app_id", "tenant_id");


--
-- Name: passwordless_codes_created_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "passwordless_codes_created_at_index" ON "public"."passwordless_codes" USING "btree" ("app_id", "tenant_id", "created_at");


--
-- Name: passwordless_codes_device_id_hash_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "passwordless_codes_device_id_hash_index" ON "public"."passwordless_codes" USING "btree" ("app_id", "tenant_id", "device_id_hash");


--
-- Name: passwordless_devices_email_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "passwordless_devices_email_index" ON "public"."passwordless_devices" USING "btree" ("app_id", "tenant_id", "email");


--
-- Name: passwordless_devices_phone_number_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "passwordless_devices_phone_number_index" ON "public"."passwordless_devices" USING "btree" ("app_id", "tenant_id", "phone_number");


--
-- Name: passwordless_devices_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "passwordless_devices_tenant_id_index" ON "public"."passwordless_devices" USING "btree" ("app_id", "tenant_id");


--
-- Name: role_permissions_permission_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "role_permissions_permission_index" ON "public"."role_permissions" USING "btree" ("app_id", "permission");


--
-- Name: role_permissions_role_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "role_permissions_role_index" ON "public"."role_permissions" USING "btree" ("app_id", "role");


--
-- Name: roles_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "roles_app_id_index" ON "public"."roles" USING "btree" ("app_id");


--
-- Name: session_expiry_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "session_expiry_index" ON "public"."session_info" USING "btree" ("expires_at");


--
-- Name: session_info_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "session_info_tenant_id_index" ON "public"."session_info" USING "btree" ("app_id", "tenant_id");


--
-- Name: tenant_default_required_factor_ids_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_default_required_factor_ids_tenant_id_index" ON "public"."tenant_required_secondary_factors" USING "btree" ("connection_uri_domain", "app_id", "tenant_id");


--
-- Name: tenant_first_factors_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_first_factors_tenant_id_index" ON "public"."tenant_first_factors" USING "btree" ("connection_uri_domain", "app_id", "tenant_id");


--
-- Name: tenant_thirdparty_provider_clients_third_party_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_thirdparty_provider_clients_third_party_id_index" ON "public"."tenant_thirdparty_provider_clients" USING "btree" ("connection_uri_domain", "app_id", "tenant_id", "third_party_id");


--
-- Name: tenant_thirdparty_providers_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_thirdparty_providers_tenant_id_index" ON "public"."tenant_thirdparty_providers" USING "btree" ("connection_uri_domain", "app_id", "tenant_id");


--
-- Name: tenants_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenants_app_id_index" ON "public"."tenants" USING "btree" ("app_id");


--
-- Name: thirdparty_users_email_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "thirdparty_users_email_index" ON "public"."thirdparty_users" USING "btree" ("app_id", "email");


--
-- Name: thirdparty_users_thirdparty_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "thirdparty_users_thirdparty_user_id_index" ON "public"."thirdparty_users" USING "btree" ("app_id", "third_party_id", "third_party_user_id");


--
-- Name: totp_used_codes_expiry_time_ms_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "totp_used_codes_expiry_time_ms_index" ON "public"."totp_used_codes" USING "btree" ("app_id", "tenant_id", "expiry_time_ms");


--
-- Name: totp_used_codes_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "totp_used_codes_tenant_id_index" ON "public"."totp_used_codes" USING "btree" ("app_id", "tenant_id");


--
-- Name: totp_used_codes_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "totp_used_codes_user_id_index" ON "public"."totp_used_codes" USING "btree" ("app_id", "user_id");


--
-- Name: totp_user_devices_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "totp_user_devices_user_id_index" ON "public"."totp_user_devices" USING "btree" ("app_id", "user_id");


--
-- Name: totp_users_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "totp_users_app_id_index" ON "public"."totp_users" USING "btree" ("app_id");


--
-- Name: user_last_active_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "user_last_active_app_id_index" ON "public"."user_last_active" USING "btree" ("app_id");


--
-- Name: user_metadata_app_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "user_metadata_app_id_index" ON "public"."user_metadata" USING "btree" ("app_id");


--
-- Name: user_roles_app_id_role_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "user_roles_app_id_role_index" ON "public"."user_roles" USING "btree" ("app_id", "role");


--
-- Name: user_roles_role_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "user_roles_role_index" ON "public"."user_roles" USING "btree" ("app_id", "tenant_id", "role");


--
-- Name: user_roles_tenant_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "user_roles_tenant_id_index" ON "public"."user_roles" USING "btree" ("app_id", "tenant_id");


--
-- Name: userid_mapping_supertokens_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "userid_mapping_supertokens_user_id_index" ON "public"."userid_mapping" USING "btree" ("app_id", "supertokens_user_id");


--
-- Name: all_auth_recipe_users all_auth_recipe_users_primary_or_recipe_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."all_auth_recipe_users"
    ADD CONSTRAINT "all_auth_recipe_users_primary_or_recipe_user_id_fkey" FOREIGN KEY ("app_id", "primary_or_recipe_user_id") REFERENCES "public"."app_id_to_user_id"("app_id", "user_id") ON DELETE CASCADE;


--
-- Name: all_auth_recipe_users all_auth_recipe_users_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."all_auth_recipe_users"
    ADD CONSTRAINT "all_auth_recipe_users_tenant_id_fkey" FOREIGN KEY ("app_id", "tenant_id") REFERENCES "public"."tenants"("app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: all_auth_recipe_users all_auth_recipe_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."all_auth_recipe_users"
    ADD CONSTRAINT "all_auth_recipe_users_user_id_fkey" FOREIGN KEY ("app_id", "user_id") REFERENCES "public"."app_id_to_user_id"("app_id", "user_id") ON DELETE CASCADE;


--
-- Name: app_id_to_user_id app_id_to_user_id_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."app_id_to_user_id"
    ADD CONSTRAINT "app_id_to_user_id_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: app_id_to_user_id app_id_to_user_id_primary_or_recipe_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."app_id_to_user_id"
    ADD CONSTRAINT "app_id_to_user_id_primary_or_recipe_user_id_fkey" FOREIGN KEY ("app_id", "primary_or_recipe_user_id") REFERENCES "public"."app_id_to_user_id"("app_id", "user_id") ON DELETE CASCADE;


--
-- Name: dashboard_user_sessions dashboard_user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."dashboard_user_sessions"
    ADD CONSTRAINT "dashboard_user_sessions_user_id_fkey" FOREIGN KEY ("app_id", "user_id") REFERENCES "public"."dashboard_users"("app_id", "user_id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dashboard_users dashboard_users_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."dashboard_users"
    ADD CONSTRAINT "dashboard_users_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: emailpassword_pswd_reset_tokens emailpassword_pswd_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailpassword_pswd_reset_tokens"
    ADD CONSTRAINT "emailpassword_pswd_reset_tokens_user_id_fkey" FOREIGN KEY ("app_id", "user_id") REFERENCES "public"."app_id_to_user_id"("app_id", "user_id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: emailpassword_user_to_tenant emailpassword_user_to_tenant_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailpassword_user_to_tenant"
    ADD CONSTRAINT "emailpassword_user_to_tenant_user_id_fkey" FOREIGN KEY ("app_id", "tenant_id", "user_id") REFERENCES "public"."all_auth_recipe_users"("app_id", "tenant_id", "user_id") ON DELETE CASCADE;


--
-- Name: emailpassword_users emailpassword_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailpassword_users"
    ADD CONSTRAINT "emailpassword_users_user_id_fkey" FOREIGN KEY ("app_id", "user_id") REFERENCES "public"."app_id_to_user_id"("app_id", "user_id") ON DELETE CASCADE;


--
-- Name: emailverification_tokens emailverification_tokens_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailverification_tokens"
    ADD CONSTRAINT "emailverification_tokens_tenant_id_fkey" FOREIGN KEY ("app_id", "tenant_id") REFERENCES "public"."tenants"("app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: emailverification_verified_emails emailverification_verified_emails_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."emailverification_verified_emails"
    ADD CONSTRAINT "emailverification_verified_emails_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: jwt_signing_keys jwt_signing_keys_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."jwt_signing_keys"
    ADD CONSTRAINT "jwt_signing_keys_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: key_value key_value_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."key_value"
    ADD CONSTRAINT "key_value_tenant_id_fkey" FOREIGN KEY ("app_id", "tenant_id") REFERENCES "public"."tenants"("app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: passwordless_codes passwordless_codes_device_id_hash_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_codes"
    ADD CONSTRAINT "passwordless_codes_device_id_hash_fkey" FOREIGN KEY ("app_id", "tenant_id", "device_id_hash") REFERENCES "public"."passwordless_devices"("app_id", "tenant_id", "device_id_hash") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: passwordless_devices passwordless_devices_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_devices"
    ADD CONSTRAINT "passwordless_devices_tenant_id_fkey" FOREIGN KEY ("app_id", "tenant_id") REFERENCES "public"."tenants"("app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: passwordless_user_to_tenant passwordless_user_to_tenant_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_user_to_tenant"
    ADD CONSTRAINT "passwordless_user_to_tenant_user_id_fkey" FOREIGN KEY ("app_id", "tenant_id", "user_id") REFERENCES "public"."all_auth_recipe_users"("app_id", "tenant_id", "user_id") ON DELETE CASCADE;


--
-- Name: passwordless_users passwordless_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."passwordless_users"
    ADD CONSTRAINT "passwordless_users_user_id_fkey" FOREIGN KEY ("app_id", "user_id") REFERENCES "public"."app_id_to_user_id"("app_id", "user_id") ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_fkey" FOREIGN KEY ("app_id", "role") REFERENCES "public"."roles"("app_id", "role") ON DELETE CASCADE;


--
-- Name: roles roles_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: session_access_token_signing_keys session_access_token_signing_keys_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_access_token_signing_keys"
    ADD CONSTRAINT "session_access_token_signing_keys_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: session_info session_info_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_info"
    ADD CONSTRAINT "session_info_tenant_id_fkey" FOREIGN KEY ("app_id", "tenant_id") REFERENCES "public"."tenants"("app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: tenant_first_factors tenant_first_factors_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenant_first_factors"
    ADD CONSTRAINT "tenant_first_factors_tenant_id_fkey" FOREIGN KEY ("connection_uri_domain", "app_id", "tenant_id") REFERENCES "public"."tenant_configs"("connection_uri_domain", "app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: tenant_required_secondary_factors tenant_required_secondary_factors_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenant_required_secondary_factors"
    ADD CONSTRAINT "tenant_required_secondary_factors_tenant_id_fkey" FOREIGN KEY ("connection_uri_domain", "app_id", "tenant_id") REFERENCES "public"."tenant_configs"("connection_uri_domain", "app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: tenant_thirdparty_provider_clients tenant_thirdparty_provider_clients_third_party_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenant_thirdparty_provider_clients"
    ADD CONSTRAINT "tenant_thirdparty_provider_clients_third_party_id_fkey" FOREIGN KEY ("connection_uri_domain", "app_id", "tenant_id", "third_party_id") REFERENCES "public"."tenant_thirdparty_providers"("connection_uri_domain", "app_id", "tenant_id", "third_party_id") ON DELETE CASCADE;


--
-- Name: tenant_thirdparty_providers tenant_thirdparty_providers_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenant_thirdparty_providers"
    ADD CONSTRAINT "tenant_thirdparty_providers_tenant_id_fkey" FOREIGN KEY ("connection_uri_domain", "app_id", "tenant_id") REFERENCES "public"."tenant_configs"("connection_uri_domain", "app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: tenants tenants_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: thirdparty_user_to_tenant thirdparty_user_to_tenant_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."thirdparty_user_to_tenant"
    ADD CONSTRAINT "thirdparty_user_to_tenant_user_id_fkey" FOREIGN KEY ("app_id", "tenant_id", "user_id") REFERENCES "public"."all_auth_recipe_users"("app_id", "tenant_id", "user_id") ON DELETE CASCADE;


--
-- Name: thirdparty_users thirdparty_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."thirdparty_users"
    ADD CONSTRAINT "thirdparty_users_user_id_fkey" FOREIGN KEY ("app_id", "user_id") REFERENCES "public"."app_id_to_user_id"("app_id", "user_id") ON DELETE CASCADE;


--
-- Name: totp_used_codes totp_used_codes_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."totp_used_codes"
    ADD CONSTRAINT "totp_used_codes_tenant_id_fkey" FOREIGN KEY ("app_id", "tenant_id") REFERENCES "public"."tenants"("app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: totp_used_codes totp_used_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."totp_used_codes"
    ADD CONSTRAINT "totp_used_codes_user_id_fkey" FOREIGN KEY ("app_id", "user_id") REFERENCES "public"."totp_users"("app_id", "user_id") ON DELETE CASCADE;


--
-- Name: totp_user_devices totp_user_devices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."totp_user_devices"
    ADD CONSTRAINT "totp_user_devices_user_id_fkey" FOREIGN KEY ("app_id", "user_id") REFERENCES "public"."totp_users"("app_id", "user_id") ON DELETE CASCADE;


--
-- Name: totp_users totp_users_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."totp_users"
    ADD CONSTRAINT "totp_users_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: user_last_active user_last_active_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_last_active"
    ADD CONSTRAINT "user_last_active_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: user_metadata user_metadata_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_metadata"
    ADD CONSTRAINT "user_metadata_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("app_id") ON DELETE CASCADE;


--
-- Name: user_roles user_roles_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_tenant_id_fkey" FOREIGN KEY ("app_id", "tenant_id") REFERENCES "public"."tenants"("app_id", "tenant_id") ON DELETE CASCADE;


--
-- Name: userid_mapping userid_mapping_supertokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."userid_mapping"
    ADD CONSTRAINT "userid_mapping_supertokens_user_id_fkey" FOREIGN KEY ("app_id", "supertokens_user_id") REFERENCES "public"."app_id_to_user_id"("app_id", "user_id") ON DELETE CASCADE;


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA "public" TO "supertokens";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE "dev_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "supertokens" WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

