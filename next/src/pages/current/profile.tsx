import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
} from '@mui/material'
import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useUserState, useSnackbarState } from '@/hooks/useGlobalState'
import { useRequireSignedIn } from '@/hooks/useRequireSignedIn'
import { fetcher } from '@/utils'

type ProfileProps = {
  name: string
  bio: string
  image: File | null
}

type ProfileFormData = {
  name: string
  bio: string
  image: File | null
}

const ProfileSettings: NextPage = () => {
  useRequireSignedIn()
  const [user, setUser] = useUserState()
  const [, setSnackbar] = useSnackbarState()

  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/user'
  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)

  const profile: ProfileProps = useMemo(() => {
    if (!data) {
      return {
        name: '',
        bio: '',
        image: null,
      }
    }
    return {
      name: data.name == null ? '' : data.name,
      bio: data.bio == null ? '' : data.bio,
      image: data.image,
    }
  }, [data])

  const { handleSubmit, control, reset } = useForm<ProfileFormData>({
    defaultValues: profile,
  })

  useEffect(() => {
    if (data) {
      reset(profile)

      setIsFetched(true)
    }
  }, [data, profile, reset])

  const onDropImage = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setImagePreview(URL.createObjectURL(file))
    setImageFile(file)
    console.log(file)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop: onDropImage })

  const onSubmit: SubmitHandler<ProfileFormData> = async (formData) => {
    if (formData.name == '') {
      return setSnackbar({
        message: '名前は必須です',
        severity: 'error',
        pathname: '/current/profile',
      })
    }
    const patchUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/user'
    const headers = {
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    const data = new FormData()
    data.append('user[name]', formData.name)
    data.append('user[bio]', formData.bio)

    if (imageFile) {
      data.append('user[image]', imageFile)
    }

    try {
      const response = await axios.patch(patchUrl, data, { headers })
      const updatedUser = response.data
      setUser({
        ...user,
        name: updatedUser.name,
        image: updatedUser.image,
      })

      setSnackbar({
        message: 'プロフィールを更新しました',
        severity: 'success',
        pathname: '/current/profile',
      })
    } catch (err) {
      console.error(err)
      setSnackbar({
        message: 'プロフィールの更新に失敗しました',
        severity: 'error',
        pathname: '/current/profile',
      })
    }
  }

  if (error) return <Error />
  if (!data || !isFetched) return <Loading />

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ backgroundColor: 'white', minHeight: '100vh' }}
      >
        <Typography variant="h4">プロフィール設定</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <div {...getRootProps()} style={{ cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'left' }}>
              アイコン選択
            </Typography>
            <Avatar
              alt="User Avatar"
              src={imagePreview}
              sx={{ width: 100, height: 100, mt: 2, mb: 2 }}
            />
          </div>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'left' }}>
          ユーザー名
        </Typography>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="text"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              placeholder="名前"
              fullWidth
              sx={{ backgroundColor: 'white' }}
            />
          )}
        />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'left' }}>
          自己紹介
        </Typography>
        <Controller
          name="bio"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="text"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              multiline
              fullWidth
              placeholder="自己紹介"
              rows={10}
              sx={{ backgroundColor: 'white' }}
            />
          )}
        />
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
    </Container>
  )
}

export default ProfileSettings
