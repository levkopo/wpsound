import {
  Button,
  HStack,
  Modal,
  ModalProps,
  TextField,
} from "@znui/react";
import { useCallback, useState } from "react";
import { ZnUIIconCloseFilled } from "@znui/icons";
import { BreakpointModel } from "../model/BreakpointModel";
import { TimeSelector } from "../components/TimeSelector";

export interface NewBreakpointModalProps extends ModalProps {
  saveBreakpoint: (breakpoint: BreakpointModel) => void;
  time: number;
  duration: number;
}

export const NewBreakpointModal = (props: NewBreakpointModalProps) => {
  const { saveBreakpoint, time, duration, dialogInterface } = props;
  const [breakpointDraft, setBreakpointDraft] = useState<BreakpointModel>({
    time,
    title: ''
  });

  const appendTime = useCallback((time: number) => {
    setBreakpointDraft(it => ({
      ...it,
      time: it.time!! + time
    }));
  }, [setBreakpointDraft]);

  console.log(time);

  return (
    <Modal
      title="Новая точка остановки"
      navigationIcon={<ZnUIIconCloseFilled />}
      onClickNavigationIcon={dialogInterface.close}
      bottomAction={
        <Button
          disabled={breakpointDraft.title.length === 0 || breakpointDraft.time!! > duration}
          onClick={() => {
            saveBreakpoint(breakpointDraft as BreakpointModel);
            dialogInterface.close();
          }}
        >
          Создать
        </Button>
      }
    >
     <HStack gap={14}>
       <HStack
         fontSize={36}
         gap={6}
         align='center'
         lineHeight={1}
       >
         <TimeSelector
           currentTime={breakpointDraft.time!!}
           duration={duration}
           append={appendTime}
           show='hours'/>

         :

         <TimeSelector
           currentTime={breakpointDraft.time!!}
           duration={duration}
           append={appendTime}
           show='minutes'/>

         :

         <TimeSelector
           currentTime={breakpointDraft.time!!}
           duration={duration}
           append={appendTime}
           show='seconds'/>
       </HStack>

       <TextField label="Название" flex={1}>
         <input
           type="text"
           onChange={(e) => {
             setBreakpointDraft((it) => {
               return {
                 ...it,
                 title: e.target.value
               };
             });
           }}
         />
       </TextField>
     </HStack>
    </Modal>
  );
};
