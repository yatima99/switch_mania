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

type PostProps = {
  title: string
  content: string
  image: File | null
  status: string
}

type PostFormData = {
  title: string
  content: string
  image: File | null
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
      }
    }
    return {
      title: data.title == null ? '' : data.title,
      content: data.content == null ? '' : data.content,
      status: data.status,
      image: data.image,
    }
  }, [data])

  const { handleSubmit, control, reset } = useForm<PostFormData>({
    defaultValues: post,
  })

  useEffect(() => {
    if (data) {
      reset(post)
      setStatusChecked(post.status == '公開中')
      setIsFetched(true)
    }
  }, [data, post, reset])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setImagePreview(URL.createObjectURL(file))
    setImageFile(file)
    console.log(file)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const onSubmit: SubmitHandler<PostFormData> = (data) => {
    if (data.title == '') {
      return setSnackbar({
        message: '記事の保存にはタイトルが必要です',
        severity: 'error',
        pathname: '/current/posts/edit/[id]',
      })
    }

    if (statusChecked && data.content == '') {
      return setSnackbar({
        message: '本文なしの記事は公開はできません',
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

    if (imageFile) {
      formData.append('post[image]', imageFile)
    }

    axios({
      method: 'PATCH',
      url: patchUrl,
      data: formData,
      headers: headers,
    })
      .then(() => {
        setSnackbar({
          message: '記事を保存しました',
          severity: 'success',
          pathname: '/current/posts/edit/[id]',
        })
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: '記事の保存に失敗しました',
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
      sx={{ backgroundColor: '#EDF2F7', minHeight: '100vh' }}
    >
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#EDF2F7',
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

              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>
                  ここに画像をドラッグ＆ドロップ、またはクリックしてファイルを選択
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
        </Box>
      </Container>
    </Box>
  )
}

export default CurrentPostsEdit
