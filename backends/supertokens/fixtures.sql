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

INSERT INTO "public"."apps" ("app_id", "created_at_time") VALUES ('public', 1733904769127);


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

INSERT INTO "public"."jwt_signing_keys" ("app_id", "key_id", "key_string", "algorithm", "created_at") VALUES ('public', 's-4016713f-204a-43ae-9068-1e07c61d894c', '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', 'RS256', 1733904769418);


--
-- Data for Name: key_value; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."key_value" ("app_id", "tenant_id", "name", "value", "created_at_time") VALUES ('public', 'public', 'refresh_token_key', '1000:d9ed0464a867b4f1481e64d8529bb9731ee357940824d64f33fd483b6a00c7ccf333e0d74e578ca92586f8e0cda756e9a961a96d0d1f67a1f9a007ef31d89141:e60d088110ed38241dd20189a04ff0c83ceffd3bc4e82787b8b8560635fda5a8792504c28bdfa8393be04390733bdbc458a65fa964e53aaa7a168fc1307c9a39', 1733904769410);
INSERT INTO "public"."key_value" ("app_id", "tenant_id", "name", "value", "created_at_time") VALUES ('public', 'public', 'TELEMETRY_ID', 'a85b3fe8-52b6-4173-8e4a-e7c42ec532a1', 1733904769478);
INSERT INTO "public"."key_value" ("app_id", "tenant_id", "name", "value", "created_at_time") VALUES ('public', 'public', 'FEATURE_FLAG', '[]', 1733905125835);


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

INSERT INTO "public"."session_access_token_signing_keys" ("app_id", "created_at_time", "value") VALUES ('public', 1733904769380, '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');


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

INSERT INTO "public"."tenants" ("app_id", "tenant_id", "created_at_time") VALUES ('public', 'public', 1733904769127);


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

