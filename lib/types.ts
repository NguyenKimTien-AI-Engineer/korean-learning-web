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

export type Database = {
  public: {
    Tables: {
      interview_questions: {
        Row: InterviewQuestion;
        Insert: Omit<InterviewQuestion, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<InterviewQuestion>;
      };
    };
  };
};
