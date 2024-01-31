import ArticleIcon from '@mui/icons-material/Article'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Logout from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'

import SettingsIcon from '@mui/icons-material/Settings'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@mui/material'

import axios, { AxiosResponse, AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useUserState, useSnackbarState } from '@/hooks/useGlobalState'

const Header = () => {
  const [user, setUser] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const router = useRouter()

  const hideHeaderPathnames = ['/current/posts/edit/[id]']
  if (hideHeaderPathnames.includes(router.pathname)) return <></>

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
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

  const addNewPost = () => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/posts'

    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    axios({ method: 'POST', url: url, headers: headers })
      .then((res: AxiosResponse) => {
        router.push('/current/posts/edit/' + res.data.id)
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message)
      })
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        py: '12px',
      }}
    >
      <Container maxWidth="lg" sx={{ px: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Link href="/">
              <Image src="/logo.png" width={133} height={40} alt="logo" />
            </Link>
          </Box>

          {user.isFetched && (
            <>
              {!user.isSignedIn && (
                <Box>
                  <Link href="/sign_in">
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        color: 'white',
                        textTransform: 'none',
                        fontSize: 16,
                        borderRadius: 2,
                        boxShadow: 'none',
                      }}
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/sign_up">
                    <Button
                      color="primary"
                      variant="outlined"
                      sx={{
                        textTransform: 'none',
                        fontSize: 16,
                        lineHeight: '27px',
                        borderRadius: 2,
                        boxShadow: 'none',
                        border: '1.5px solid #3EA8FF',
                        ml: 2,
                      }}
                    >
                      Sign Up
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
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
                      ml: 2,
                    }}
                    onClick={guestLogin}
                  >
                    Guest Login
                  </Button>
                </Box>
              )}
              {user.isSignedIn && (
                <Box sx={{ display: 'flex' }}>
                  <IconButton onClick={handleClick} sx={{ p: 0 }}>
                    <Avatar src={user.image ? user.image.url : undefined}>
                      {!user.image && <PersonIcon />}
                    </Avatar>
                  </IconButton>
                  <Box sx={{ ml: 2 }}>
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        color: 'white',
                        textTransform: 'none',
                        fontSize: 16,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        width: 100,
                        boxShadow: 'none',
                      }}
                      onClick={addNewPost}
                    >
                      投稿する
                    </Button>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                  >
                    <Box sx={{ pl: 2, py: 1 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {user.name}
                      </Typography>
                    </Box>
                    <Divider />
                    <Link href="/current/posts">
                      <MenuItem>
                        <ListItemIcon>
                          <ArticleIcon fontSize="small" />
                        </ListItemIcon>
                        投稿の管理
                      </MenuItem>
                    </Link>
                    <Link href="/current/liked_posts">
                      <MenuItem>
                        <ListItemIcon>
                          <FavoriteIcon fontSize="small" />
                        </ListItemIcon>
                        いいねの管理
                      </MenuItem>
                    </Link>
                    <Link href="/current/profile">
                      <MenuItem>
                        <ListItemIcon>
                          <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        プロフィール設定
                      </MenuItem>
                    </Link>
                    <Link href="/sign_out">
                      <MenuItem>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        サインアウト
                      </MenuItem>
                    </Link>
                  </Menu>
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
    </AppBar>
  )
}

export default Header
