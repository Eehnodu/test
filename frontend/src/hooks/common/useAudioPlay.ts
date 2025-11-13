import { useEffect, useRef, useState } from "react";

/**
 * 재생/정지 상태와 현재 재생 중인 항목 ID를 관리하는 공용 오디오 훅.
 * - play(url, id): 해당 url을 재생. 같은 id가 다시 들어오면 토글(재생/일시정지)
 * - stop(): 강제 정지
 * - isPlaying: 오디오 엘리먼트의 재생 상태
 * - currentId: 현재 재생 중인 비즈니스 ID(문장 ID 등)
 */
export function useAudioPlay() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // 오디오 인스턴스 생성 & 리스너 바인딩
  const ensureAudio = () => {
    if (audioRef.current) return audioRef.current;

    const a = new Audio();
    a.addEventListener("play", () => setIsPlaying(true));
    a.addEventListener("pause", () => setIsPlaying(false));
    a.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentId(null);
    });
    a.addEventListener("error", () => {
      setIsPlaying(false);
      setCurrentId(null);
    });

    audioRef.current = a;
    return a;
  };

  /**
   * 지정한 URL과 ID로 재생. 같은 ID가 들어오면 토글(재생↔정지).
   */
  async function play(url: string, id: number) {
    const audio = ensureAudio();

    if (currentId === id) {
      if (audio.paused) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (e) {
          console.error("Audio play error:", e);
        }
      } else {
        audio.pause();
      }
      return;
    }

    if (audio.src !== url) {
      audio.src = url;
    }
    audio.currentTime = 0;

    try {
      await audio.play();
      setCurrentId(id);
      setIsPlaying(true);
    } catch (e) {
      console.error("Audio play error:", e);
      setIsPlaying(false);
      setCurrentId(null);
    }
  }

  function stop() {
    const audio = ensureAudio();
    audio.pause();
  }

  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (!a) return;
      a.pause();
      a.src = "";
      a.load?.();
      audioRef.current = null;
    };
  }, []);

  return { play, stop, isPlaying, currentId };
}

export function audioUrl(avatar, sentenceId, baseURL) {
  const sentence = avatar?.sentences.find((s) => s.sentence_id === sentenceId);
  if (!sentence?.sentence_url) return null;
  return `${baseURL}/${sentence.sentence_url}`;
}
