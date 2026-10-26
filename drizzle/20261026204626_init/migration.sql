CREATE TYPE "user_role" AS ENUM('admin', 'guest');--> statement-breakpoint
CREATE TYPE "server_event_type" AS ENUM('info', 'warning', 'error');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"jti" text NOT NULL UNIQUE,
	"jwt" text NOT NULL UNIQUE,
	"created" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"username" text NOT NULL,
	"name" text NOT NULL,
	"action" text NOT NULL,
	"target" text NOT NULL,
	"data" jsonb,
	"message" text,
	"impersonated" text,
	"created" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL,
	"name" text NOT NULL,
	"satisfaction" integer NOT NULL,
	"message" text NOT NULL,
	"created" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "server_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"type" "server_event_type" DEFAULT 'info'::"server_event_type" NOT NULL,
	"message" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"updated" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"username" text NOT NULL UNIQUE,
	"roles" "user_role"[] DEFAULT '{guest}'::"user_role"[] NOT NULL,
	"active" boolean DEFAULT true,
	"blocked" boolean DEFAULT false,
	"internal" boolean DEFAULT false,
	"created" timestamp DEFAULT now(),
	"updated" timestamp,
	"lastLogin" timestamp
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;