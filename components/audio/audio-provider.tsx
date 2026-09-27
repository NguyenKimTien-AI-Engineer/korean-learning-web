"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { InterviewQuestion } from "@/lib/types";
import { markListened } from "@/lib/progress";
import { useAuth } from "@/components/auth/auth-provider";

type AudioContextValue = {
  current: InterviewQuestion | null;
  isPlaying: boolean;
  toggle: (question: InterviewQuestion) => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({
  section,
  children,
}: {
  section: string;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState<InterviewQuestion | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = useCallback(
    (question: InterviewQuestion) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (current?.global_order === question.global_order) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          audio.play();
          setIsPlaying(true);
        }
        return;
      }

      audio.src = question.audio_url;
      audio.play();
      setCurrent(question);
      setIsPlaying(true);
    },
    [current, isPlaying],
  );

  return (
    <AudioCtx.Provider value={{ current, isPlaying, toggle }}>
      {children}
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => {
          setIsPlaying(false);
          if (current && user) {
            markListened(user.id, section, current.global_order);
          }
        }}
      />
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio phai dung ben trong AudioProvider");
  return ctx;
}
