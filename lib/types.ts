export type InterviewQuestion = {
  id: string;
  global_order: number;
  section: "B" | "C";
  section_position: number;
  question_ko: string;
  question_vi: string | null;
  pronunciation: string | null;
  audio_path: string;
  audio_url: string;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserQuestionProgress = {
  user_id: string;
  section: string;
  global_order: number;
  listened_at: string;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  section: string;
  score: number;
  total: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      interview_questions: {
        Row: InterviewQuestion;
        Insert: Omit<InterviewQuestion, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<InterviewQuestion>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      user_question_progress: {
        Row: UserQuestionProgress;
        Insert: Omit<UserQuestionProgress, "listened_at"> & {
          listened_at?: string;
        };
        Update: Partial<UserQuestionProgress>;
        Relationships: [];
      };
      quiz_attempts: {
        Row: QuizAttempt;
        Insert: Omit<QuizAttempt, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<QuizAttempt>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
