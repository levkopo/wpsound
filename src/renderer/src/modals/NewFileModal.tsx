import { Button, ListItem, Modal, ModalProps, TextField, znui } from "@znui/react";
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { ProjectModel } from '../model/ProjectModel'
import { ZnUIIconCloseFilled } from '@znui/icons'

export interface NewFileModalProps extends ModalProps {
  setProject: Dispatch<SetStateAction<ProjectModel | null>>
}

export const NewFileModal = (props: NewFileModalProps) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const { setProject, dialogInterface } = props
  const [projectDraft, setProjectDraft] = useState<Partial<ProjectModel>>({
    breaks: []
  })

  return (
    <Modal
      title="Новый файл"
      navigationIcon={<ZnUIIconCloseFilled />}
      onClickNavigationIcon={dialogInterface.close}
      bottomAction={
        <Button
          disabled={!projectDraft.audio && !projectDraft.meta}
          onClick={() => {
            setProject(projectDraft as ProjectModel)
            dialogInterface.close()
          }}
        >
          Создать
        </Button>
      }
    >
      <TextField label="Название">
        <input
          type="text"
          onChange={(e) => {
            setProjectDraft((it) => {
              return {
                ...it,
                meta:
                  e.target.value.length === 0
                    ? undefined
                    : {
                        ...it.meta,
                        title: e.target.value
                      },
              }
            })
          }}
        />
      </TextField>

      <TextField
        label="Автор"
        to={{
          maxH: projectDraft?.meta?.title ? 100 : 0,
          oc: projectDraft?.meta?.title ? 1 : 0
        }}
      >
        <input
          type="text"
          onChange={(e) => {
            setProjectDraft((it) => ({
              ...it,
              meta: {
                author: e.target.value,
                title: it.meta!.title
              },
            }))
          }}
        />
      </TextField>

      <ListItem
        heading="Выбрать аудиодорожку"
        supportText={projectDraft.audio ? 'Выбрана' : 'Не выбрана'}
        onClick={() => {
          fileRef.current?.click()
        }}
      />

      <znui.input
        display="none"
        type="file"
        ref={fileRef}
        onChange={(e) => {
          const file = e.target.files![0]
          const blob = new Blob([file], { type: file.type })

          setProjectDraft((it) => ({
            ...it,
            audio: blob
          }))
        }}
      />
    </Modal>
  )
}
