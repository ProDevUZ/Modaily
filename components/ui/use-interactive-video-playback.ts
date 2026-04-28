"use client";

import { useEffect, useRef, useState } from "react";

type UseInteractiveVideoPlaybackOptions = {
  videoUrl?: string | null;
  isActive?: boolean;
  onActivate?: () => void;
  resetOnInactive?: boolean;
};

export function formatInteractiveVideoTime(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function useInteractiveVideoPlayback({
  videoUrl,
  isActive = false,
  onActivate,
  resetOnInactive = true
}: UseInteractiveVideoPlaybackOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const centerIconTimeoutRef = useRef<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [centerIcon, setCenterIcon] = useState<"play" | "pause" | null>(null);

  function clearCenterIconTimeout() {
    if (centerIconTimeoutRef.current !== null) {
      window.clearTimeout(centerIconTimeoutRef.current);
      centerIconTimeoutRef.current = null;
    }
  }

  function showCenterIcon(kind: "play" | "pause", autoHide: boolean) {
    clearCenterIconTimeout();
    setCenterIcon(kind);

    if (autoHide) {
      centerIconTimeoutRef.current = window.setTimeout(() => {
        setCenterIcon(null);
        centerIconTimeoutRef.current = null;
      }, 1000);
    }
  }

  useEffect(() => {
    clearCenterIconTimeout();
    setFailed(false);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setCenterIcon(null);
  }, [videoUrl]);

  useEffect(() => {
    if (!videoRef.current || !videoUrl || !resetOnInactive) {
      return;
    }

    if (!isActive) {
      clearCenterIconTimeout();
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      setPlaying(false);
      setCurrentTime(0);
      setCenterIcon(null);
    }
  }, [isActive, resetOnInactive, videoUrl]);

  useEffect(
    () => () => {
      clearCenterIconTimeout();
    },
    []
  );

  async function startPlayback() {
    if (!videoRef.current || !videoUrl || failed) {
      return;
    }

    videoRef.current.muted = false;
    videoRef.current.currentTime = 0;

    try {
      await videoRef.current.play();
      setPlaying(true);
      showCenterIcon("play", true);
    } catch {
      try {
        videoRef.current.muted = true;
        await videoRef.current.play();
        setPlaying(true);
        showCenterIcon("play", true);
      } catch {
        setPlaying(false);
      }
    }

    onActivate?.();
  }

  async function togglePause() {
    if (!videoRef.current || !videoUrl || failed) {
      return;
    }

    if (videoRef.current.paused) {
      try {
        await videoRef.current.play();
        setPlaying(true);
        showCenterIcon("play", true);
      } catch {
        // Keep previous state if playback stays blocked.
      }

      return;
    }

    videoRef.current.pause();
    setPlaying(false);
    showCenterIcon("pause", false);
  }

  function handleProgressChange(nextValue: number) {
    if (!videoRef.current || !videoUrl || failed) {
      return;
    }

    videoRef.current.currentTime = nextValue;
    setCurrentTime(nextValue);
  }

  return {
    videoRef,
    failed,
    playing,
    currentTime,
    duration,
    centerIcon,
    startPlayback,
    togglePause,
    handleProgressChange,
    videoEvents: {
      onLoadedMetadata: (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const nextDuration = event.currentTarget.duration;
        setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
      },
      onTimeUpdate: (event: React.SyntheticEvent<HTMLVideoElement>) => {
        setCurrentTime(event.currentTarget.currentTime);
      },
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
      onEnded: () => setPlaying(false),
      onError: () => {
        setFailed(true);
        setPlaying(false);
      }
    }
  };
}
