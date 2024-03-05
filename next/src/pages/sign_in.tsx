import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
} from '@mui/material'
import axios, { AxiosResponse, AxiosError } from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useUserState, useSnackbarState } from '@/hooks/useGlobalState'

type SignInFormData = {
  email: string
  password: string
}

const SignIn: NextPage = () => {
  const router = useRouter()
  const [user, setUser] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  const { handleSubmit, control } = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
  })

  const validationRules = {
    email: {
      required: 'メールアドレスを入力してください。',
      pattern: {
        value:
          /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: '正しい形式のメールアドレスを入力してください。',
      },
    },
    password: {
      required: 'パスワードを入力してください。',
    },
  }

  const onSubmit: SubmitHandler<SignInFormData> = (data) => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/sign_in'
    const headers = { 'Content-Type': 'application/json' }

    axios({ method: 'POST', url: url, data: data, headers: headers })
      .then((res: AxiosResponse) => {
        localStorage.setItem('access-token', res.headers['access-token'])
        localStorage.setItem('client', res.headers['client'])
        localStorage.setItem('uid', res.headers['uid'])
        setUser({
          ...user,
          isFetched: false,
        })
        setSnackbar({
          message: 'サインインしました',
          severity: 'success',
          pathname: '/',
        })
        router.push('/')
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message)
        setSnackbar({
          message: '登録ユーザーが見つかりません',
          severity: 'error',
          pathname: '/sign_in',
        })
      })
  }

  const guestLogin = () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/guest_login`
    const headers = { 'Content-Type': 'application/json' }

    axios({ method: 'POST', url: url, headers: headers })
      .then((res: AxiosResponse) => {
        localStorage.setItem('access-token', res.headers['access-token'])
        localStorage.setItem('client', res.headers['client'])
        localStorage.setItem('uid', res.headers['uid'])

        console.log(res.headers['access-token'])
        console.log(res.headers['client'])
        console.log(res.headers['uid'])

        setUser({
          ...user,
          isFetched: false,
          isSignedIn: true,
        })

        setSnackbar({
          message: 'ゲストとしてログインしました。',
          severity: 'success',
          pathname: '/',
        })

        router.push('/')
      })
      .catch((error) => {
        console.error('ゲストログインに失敗しました。', error)
        setSnackbar({
          message: 'ゲストログインに失敗しました。',
          severity: 'error',
          pathname: '/',
        })
      })
  }

  return (
    <>
      <Head>
        <title> Sign in | Switch Mania </title>
      </Head>
      <Box
        sx={{
          backgroundColor: '#E8F5E9',
          minHeight: 'calc(100vh - 57px)',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 4, pt: 4 }}>
            <Typography
              component="h2"
              sx={{ fontSize: 32, color: 'black', fontWeight: 'bold' }}
            >
              Sign in
            </Typography>
          </Box>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  label="メールアドレス"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={validationRules.password}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="password"
                  label="パスワード"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{ fontWeight: 'bold', color: 'white' }}
            >
              送信
            </Button>
            <Typography textAlign="center" sx={{ my: 2 }}>
              または
            </Typography>
            <Button
              variant="outlined"
              sx={{
                textTransform: 'none',
                fontSize: 16,
                lineHeight: '27px',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1.5px solid #4CAF50',
                backgroundColor: '#4CAF50',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#45a049',
                  borderColor: '#45a049',
                },
              }}
              onClick={guestLogin}
            >
              Guest Login
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  )
}
export default SignIn
