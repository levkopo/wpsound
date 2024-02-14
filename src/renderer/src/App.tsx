import {
  Divider,
  HStack,
  ImageView,
  NavigationDrawer,
  ThemeTokens,
  Title,
  useDialogs,
  useSnackbar,
  VStack
} from '@znui/react'
import { PlayerScreen } from './components/PlayerScreen'
import { useEffect, useState } from 'react'
import WPSLogotpye from './assets/WPSLogotype.svg'
import { ProjectModel } from './model/ProjectModel'
import { NewFileModal } from './modals/NewFileModal'
import { pack, unpack } from "msgpackr";
import { ProjectFileModel } from './model/ProjectFileModel'

function App() {
  const [openedLeftMenu, setOpenedLeftMenu] = useState(true)
  const [project, setProject] = useState<ProjectModel | null>(null)
  const dialogs = useDialogs()
  const snackbar = useSnackbar()

  useEffect(() => {
    window.electron.ipcRenderer.on('saved', () => {
      snackbar({ text: 'Файл сохранен!' })
    })

    window.electron.ipcRenderer.on('file-input', (_, args) => {
      const projectFile = unpack(args.project) as ProjectFileModel
      setProject({
        meta: projectFile.meta,
        audio: new Blob([projectFile.audio.arrayBuffer], { type: projectFile.audio.type }),
        breaks: projectFile.breaks
      })
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners('file-input')
      window.electron.ipcRenderer.removeAllListeners('saved')
    }
  }, [snackbar])

  return (
    <HStack bg={ThemeTokens.surface} c={ThemeTokens.onSurface} pos="absolute" posA={0}>
      <NavigationDrawer
        w={300}
        to={{
          baseDuration: 500,
          maxW: openedLeftMenu ? '100vw' : 0
        }}
        compat={true}
      >
        <HStack gap={12} align="center">
          <ImageView layoutSize={32} src={WPSLogotpye} />

          <Title size="large" fontWeight={600} lineHeight={1}>
            WPSound
          </Title>
        </HStack>

        <Divider mv={12} />

        <NavigationDrawer.Item
          onClick={() => {
            dialogs.showModal(
              (rest) => <NewFileModal setProject={setProject} {...rest} />,
              undefined,
              {
                fullscreen: false
              }
            )
          }}
        >
          Новый файл
        </NavigationDrawer.Item>

        <NavigationDrawer.Item
          onClick={() => {
            window.electron.ipcRenderer.send('open-file')
          }}
        >
          Открыть файл
        </NavigationDrawer.Item>

        {project && (
          <NavigationDrawer.Item
            onClick={() => {
              setTimeout(async () => {
                const projectFile: ProjectFileModel = {
                  meta: project.meta,
                  audio: {
                    arrayBuffer: await project.audio.arrayBuffer(),
                    type: project.audio.type
                  },
                  breaks: project.breaks
                }

                window.electron.ipcRenderer.send('save-file', {
                  project: pack(projectFile)
                })
              })
            }}
          >
            Сохранить
          </NavigationDrawer.Item>
        )}
      </NavigationDrawer>

      <VStack alignSelf="stretch" flex={1}>
        <PlayerScreen
          setOpenedLeftMenu={setOpenedLeftMenu}
          project={project}
          reload={() => {
            setProject(it => ({ ... it }) as ProjectModel)
          }}
        />
      </VStack>
    </HStack>
  )
}

export default App
