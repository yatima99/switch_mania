import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Switch,
  TextField,
  Toolbar,
  Typography,
  Chip,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useUserState, useSnackbarState } from '@/hooks/useGlobalState'
import { useRequireSignedIn } from '@/hooks/useRequireSignedIn'
import { fetcher } from '@/utils'

type Tag = {
  id: string
  name: string
}

type PostProps = {
  title: string
  content: string
  image: File | null
  audio: File | null
  status: string
  tags: { name: string }[]
}

type PostFormData = {
  title: string
  content: string
  image: File | null
  audio: File | null
  tags: { name: string }[]
}

const CurrentPostsEdit: NextPage = () => {
  useRequireSignedIn()
  const router = useRouter()
  const [user] = useUserState()
  const [, setSnackbar] = useSnackbarState()

  const [statusChecked, setStatusChecked] = useState<boolean>(false)
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioPreview, setAudioPreview] = useState<string | null>(null)

  const [tags, setTags] = useState<Tag[]>([])
  const [inputValue, setInputValue] = useState('')
  const handleChangeStatusChecked = () => {
    setStatusChecked(!statusChecked)
  }

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/posts/'
  const { id } = router.query
  const { data, error } = useSWR(
    user.isSignedIn && id ? url + id : null,
    fetcher,
  )

  const post: PostProps = useMemo(() => {
    if (!data) {
      return {
        title: '',
        content: '',
        status: false,
        image: null,
        audio: null,
        tags: [],
      }
    }
    return {
      title: data.title == null ? '' : data.title,
      content: data.content == null ? '' : data.content,
      status: data.status,
      image: data.image,
      audio: data.audio,
      tags: data.tags || [],
    }
  }, [data])

  const { handleSubmit, control, reset } = useForm<PostFormData>({
    defaultValues: post,
  })

  useEffect(() => {
    if (data) {
      reset(post)
      setStatusChecked(post.status == '公開中')

      if (data.tags) {
        const formattedTags = data.tags.map(
          (tag: { name: string }, index: number) => ({
            id: index.toString(),
            text: tag.name,
          }),
        )
        setTags(formattedTags)
      }

      setIsFetched(true)
    }
  }, [data, post, reset])

  const onDropImage = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setImagePreview(URL.createObjectURL(file))
    setImageFile(file)
    console.log(file)
  }, [])

  const onDropAudio = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setAudioPreview(URL.createObjectURL(file))
    setAudioFile(file)
    console.log(file)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop: onDropImage })
  const { getRootProps: getRootPropsAudio, getInputProps: getInputPropsAudio } =
    useDropzone({ onDrop: onDropAudio })

  const handleDelete = (tagToDelete: Tag) => {
    setTags(tags.filter((tag) => tag.id !== tagToDelete.id))
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue) {
      event.preventDefault()
      if (!tags.some((tag) => tag.name === inputValue)) {
        setTags((prevTags) => [
          ...prevTags,
          { id: Date.now().toString(), name: inputValue },
        ])
      }
      setInputValue('')
    }
  }

  const onSubmit: SubmitHandler<PostFormData> = (data) => {
    if (data.title == '') {
      return setSnackbar({
        message: '投稿の保存にはタイトルが必要です',
        severity: 'error',
        pathname: '/current/posts/edit/[id]',
      })
    }

    if (!audioFile) {
      return setSnackbar({
        message: '音声ファイルをアップロードしてください',
        severity: 'error',
        pathname: '/current/posts/edit/[id]',
      })
    }

    if (tags.length === 0) {
      return setSnackbar({
        message: '少なくとも1つのタグを追加してください',
        severity: 'error',
        pathname: '/current/posts/edit/[id]',
      })
    }

    const patchUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + '/current/posts/' + id

    const headers = {
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    const formData = new FormData()
    formData.append('post[title]', data.title)
    formData.append('post[content]', data.content)
    formData.append('post[status]', statusChecked ? 'published' : 'draft')
    formData.append('post[tags]', tags.map((tag) => tag.name).join(' '))

    if (imageFile) {
      formData.append('post[image]', imageFile)
    }
    if (audioFile) {
      formData.append('post[audio]', audioFile)
    }

    axios({
      method: 'PATCH',
      url: patchUrl,
      data: formData,
      headers: headers,
    })
      .then(() => {
        setSnackbar({
          message: '投稿を保存しました',
          severity: 'success',
          pathname: '/current/posts/edit/[id]',
        })
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: '投稿の保存に失敗しました',
          severity: 'error',
          pathname: '/current/posts/edit/[id]',
        })
      })
  }

  if (error) return <Error />
  if (!data || !isFetched) return <Loading />

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ backgroundColor: '#E8F5E9', minHeight: '100vh' }}
    >
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#ffffff',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: 50 }}>
            <Link href="/current/posts">
              <IconButton>
                <ArrowBackSharpIcon />
              </IconButton>
            </Link>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: { xs: '0 16px', sm: '0 24px' },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Switch
                checked={statusChecked}
                onChange={handleChangeStatusChecked}
              />
              <Typography sx={{ fontSize: { xs: 12, sm: 15 } }}>
                下書き／公開
              </Typography>
            </Box>
            <Button
              variant="contained"
              type="submit"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: 12, sm: 16 },
              }}
            >
              更新する
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{ pt: 11, pb: 3, display: 'flex', justifyContent: 'center' }}
      >
        <Box sx={{ width: 840 }}>
          <Box sx={{ mb: 2 }}>
            <h1>タイトル</h1>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  placeholder="Write in Title"
                  fullWidth
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <h1>画像</h1>
            <div>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  width={300}
                  height={200}
                  alt="Preview"
                />
              )}

              <div
                {...getRootProps()}
                style={{
                  border: '2px dashed #cccccc',
                  padding: '20px',
                  textAlign: 'center',
                  marginTop: '10px',
                  cursor: 'pointer',
                }}
              >
                <input {...getInputProps()} />
                <p>
                  ここに画像ファイルをドラッグ＆ドロップ、またはクリックしてファイルを選択
                </p>
              </div>
            </div>
          </Box>

          <Box sx={{ mb: 2 }}>
            <h1>音声ファイル</h1>
            <div>
              {audioPreview && (
                <audio controls>
                  <source src={audioPreview} type="audio/mpeg" />
                  お使いのブラウザはオーディオタグをサポートしていません。
                </audio>
              )}
              <div
                {...getRootPropsAudio()}
                style={{
                  border: '2px dashed #cccccc',
                  padding: '20px',
                  textAlign: 'center',
                  marginTop: '10px',
                  cursor: 'pointer',
                }}
              >
                <input {...getInputPropsAudio()} />
                <p>
                  ここに音声ファイルをドラッグ＆ドロップ、またはクリックしてファイルを選択
                </p>
              </div>
            </div>
          </Box>

          <Box>
            <h1>説明</h1>
            <Controller
              name="content"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="textarea"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  multiline
                  fullWidth
                  placeholder="Write in Text"
                  rows={10}
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
          </Box>
          <Box>
            <TextField
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="タグを入力"
              variant="outlined"
              size="small"
              sx={{ width: 'auto', flexGrow: 1 }}
            />
          </Box>
          <Typography variant="h6">
            スイッチの種類をタグに含めてください（例: CherryRed）
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag.name}
                onDelete={() => handleDelete(tag)}
                color="primary"
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default CurrentPostsEdit
