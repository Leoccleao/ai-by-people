/**
 * Tipos das tabelas da plataforma VOD (migration 20260902120000_platform_vod.sql).
 *
 * `types.ts` é regenerado pelo Lovable a partir do banco e seria sobrescrito, então
 * o schema da plataforma vive aqui à parte. Quando o Lovable regerar `types.ts`
 * já com estas tabelas, este arquivo pode ser apagado e os imports trocados.
 */

export type AppRole = "participant" | "admin";
export type UserOrigin = "invite" | "self_signup";
export type ContentStatus = "published" | "coming_soon";
export type EngagementType =
  | "page_view"
  | "video_play"
  | "video_complete"
  | "download"
  | "oh_signup";
export type RequestStatus = "novo" | "em_contato" | "agendado" | "recusado";
export type StoryStatus = "nova" | "em_avaliacao" | "selecionada" | "arquivada";

export type Profile = {
  id: string;
  email: string;
  email_domain: string;
  name: string | null;
  company: string | null;
  role_lob: string | null;
  origin: UserOrigin;
  is_active: boolean;
  terms_accepted_at: string | null;
  created_at: string;
  last_seen_at: string | null;
};

export type UserRole = {
  user_id: string;
  role: AppRole;
  created_at: string;
};

export type InvitedEmail = {
  email: string;
  invited_by: string | null;
  note: string | null;
  created_at: string;
  claimed_at: string | null;
};

export type Lob = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  status: ContentStatus;
  instructor: string | null;
  instructor_title: string | null;
  instructor_photo_url: string | null;
  video_url: string | null;
  body_md: string | null;
  event_date: string | null;
  duration_min: number | null;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Asset = {
  id: string;
  lob_id: string;
  filename: string;
  content_type: string | null;
  size_bytes: number | null;
  storage_key: string;
  sort_order: number;
  created_at: string;
};

export type EngagementEvent = {
  id: number;
  user_id: string;
  lob_id: string | null;
  asset_id: string | null;
  type: EngagementType;
  email_domain: string | null;
  created_at: string;
};

export type LobProgress = {
  user_id: string;
  lob_id: string;
  watched_at: string | null;
};

export type OfficeHour = {
  id: string;
  lob_id: string | null;
  title: string;
  description: string | null;
  instructor: string | null;
  starts_at: string;
  duration_min: number;
  meeting_url: string | null;
  recording_url: string | null;
  capacity: number | null;
  created_at: string;
};

export type OfficeHourSignup = {
  id: string;
  office_hour_id: string;
  user_id: string;
  created_at: string;
};

export type CompanyWebinarRequest = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  company: string | null;
  lob_slugs: string[];
  audience_size: string | null;
  preferred_windows: string | null;
  notes: string | null;
  status: RequestStatus;
  created_at: string;
};

export type SuccessStory = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  company: string | null;
  lob_id: string | null;
  title: string;
  description: string;
  video_url: string;
  consent_contact_at: string;
  consent_no_publish_ack_at: string;
  status: StoryStatus;
  created_at: string;
};

export type DomainStats = {
  domain: string;
  users: number;
  active_30d: number;
  video_plays: number;
  downloads: number;
  oh_signups: number;
  last_seen_at: string | null;
};

/** Colunas geradas pelo banco que nunca precisam ir num insert. */
type Generated = "id" | "created_at" | "updated_at";

type TableDef<Row, Optional extends keyof Row = never> = {
  Row: Row;
  Insert: Omit<Row, Extract<Generated | Optional, keyof Row>> &
    Partial<Pick<Row, Extract<Generated | Optional, keyof Row>>>;
  Update: Partial<Row>;
  Relationships: [];
};

export type PlatformDatabase = {
  public: {
    Tables: {
      profiles: TableDef<
        Profile,
        | "name"
        | "company"
        | "role_lob"
        | "origin"
        | "is_active"
        | "terms_accepted_at"
        | "last_seen_at"
      >;
      user_roles: TableDef<UserRole>;
      invited_emails: TableDef<InvitedEmail, "invited_by" | "note" | "claimed_at">;
      allowed_domains: TableDef<{ domain: string; created_at: string }>;
      blocked_domains: TableDef<{ domain: string }>;
      bootstrap_admins: TableDef<{ email: string }>;
      lobs: TableDef<
        Lob,
        | "subtitle"
        | "status"
        | "instructor"
        | "instructor_title"
        | "instructor_photo_url"
        | "video_url"
        | "body_md"
        | "event_date"
        | "duration_min"
        | "tags"
        | "sort_order"
      >;
      assets: TableDef<Asset, "content_type" | "size_bytes" | "sort_order">;
      engagement_events: TableDef<EngagementEvent, "lob_id" | "asset_id" | "email_domain">;
      lob_progress: TableDef<LobProgress, "watched_at">;
      office_hours: TableDef<
        OfficeHour,
        | "lob_id"
        | "description"
        | "instructor"
        | "duration_min"
        | "meeting_url"
        | "recording_url"
        | "capacity"
      >;
      office_hours_signups: TableDef<OfficeHourSignup>;
      company_webinar_requests: TableDef<
        CompanyWebinarRequest,
        | "user_id"
        | "company"
        | "lob_slugs"
        | "audience_size"
        | "preferred_windows"
        | "notes"
        | "status"
      >;
      success_stories: TableDef<SuccessStory, "user_id" | "company" | "lob_id" | "status">;
    };
    Views: {
      admin_domain_stats: {
        Row: DomainStats;
        Relationships: [];
      };
    };
    Functions: Record<never, never>;
    Enums: {
      app_role: AppRole;
      user_origin: UserOrigin;
      content_status: ContentStatus;
      engagement_type: EngagementType;
      request_status: RequestStatus;
      story_status: StoryStatus;
    };
    CompositeTypes: Record<never, never>;
  };
};
