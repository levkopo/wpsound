import {
  znui,
  Center,
  Headline,
  HStack,
  IconButton,
  ScrollLayout,
  ThemeTokens, Title,
  VStack, Slider, Tappable, IconWrapper, useDialogs
} from "@znui/react";
import { ZnUIIconAddFilled, ZnUIIconMenuFilled, ZnUIIconPauseFilled, ZnUIIconPlayFilled } from "@znui/icons";
import { Breakpoint } from "./Breakpoint";
import React, { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { ProjectModel } from "../model/ProjectModel";
import { secondsToTime } from "../utils/time";
import { NewBreakpointModal } from "../modals/NewBreakpointModal";

export type PlayerScreenProps = {
  setOpenedLeftMenu: React.Dispatch<SetStateAction<boolean>>
  project: ProjectModel | null
  reload: () => void
}

export const PlayerScreen = (props: PlayerScreenProps) => {
  const dialogs = useDialogs()
  const audioRef = useRef<HTMLAudioElement>(null);
  const { setOpenedLeftMenu, project } = props;
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const seekTo = useCallback((time) => {
    const audioElement = audioRef.current;
    if (audioElement) {
      setProgress(time)
      audioElement.currentTime = time
    }
  }, [setProgress, audioRef])

  const togglePause = useCallback(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      setPaused(it => !it);
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    }
  }, [setPaused, audioRef]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && project && audioElement.duration != duration) {
      audioElement.src = URL.createObjectURL(project.audio)
      audioElement.play().then(() => {
        audioElement.pause()
        setDuration(audioElement.duration)

        audioElement.addEventListener('timeupdate', (_) => {
          setProgress(audioElement.currentTime)
        })
      })
    }
  }, [project, audioRef, duration, setProgress])

  return (
    <>
      <znui.audio
        ref={audioRef}
        display="none"
      />

      <HStack bg={ThemeTokens.surfaceContainer} h={80} ph={12} align="center" gap={12}>
        <IconButton onClick={() => setOpenedLeftMenu((it) => !it)}>
          <ZnUIIconMenuFilled />
        </IconButton>

        {
          project && <>
            <VStack flex={1}>
              <Title>{project.meta.title}</Title>
              {project.meta.author && <Title oc={0.7}>{project.meta.author}</Title>}
            </VStack>

            <IconButton onClick={togglePause}>
              {paused ? <ZnUIIconPlayFilled /> : <ZnUIIconPauseFilled />}
            </IconButton>
          </>
        }
      </HStack>

      {project && audioRef.current &&
        <HStack ph={16} pv={12} bg={ThemeTokens.surfaceContainerLow}>
          <Slider
            flex={1}
            max={duration}
            min={0}
            value={progress}
            onChange={(e) => {
              if(!paused) {
                togglePause()
              }

              seekTo(e.target.value)
              togglePause()
            }}
          />

          <Title>{
            secondsToTime(progress) + '/' + secondsToTime(duration)
          }</Title>

          <Tappable ml={12} onClick={() => {
            dialogs.showModal((rest) => <NewBreakpointModal
              saveBreakpoint={(breakpoint) => {
                project.breaks.push(breakpoint)
              }}
              duration={duration}
              time={progress}
              {...rest}
            />, undefined, {
              fullscreen: false
            })
          }}>
            <IconWrapper size={24}>
              <ZnUIIconAddFilled/>
            </IconWrapper>
          </Tappable>
        </HStack>
      }

      {project ? (
        <ScrollLayout orientation="vertical" alignSelf="stretch" h="100%">
          <VStack>
            {project.breaks.sort((a, b) => a.time - b.time).map((breakpoint) => (
              <Breakpoint
                key={"breakpoint" + breakpoint.time}
                breakpoint={breakpoint}
                onClick={() => {
                  seekTo(breakpoint.time)
                  if(paused) {
                    togglePause()
                  }
                }}
              />
            ))}
          </VStack>
        </ScrollLayout>
      ) : (
        <Center alignSelf="stretch" h="100%">
          <Headline size="small">Пока что пусто...</Headline>
        </Center>
      )}
    </>
  );
};
