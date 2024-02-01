import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Box,
  Container,
  Divider,
  Tooltip,
  Typography,
  IconButton,
  Link,
  Card,
  CardMedia,
} from '@mui/material'

import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import useSWR, { mutate } from 'swr'
import DeleteDialog from '@/components/DeleteDialog'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useUserState, useSnackbarState } from '@/hooks/useGlobalState'
import { useRequireSignedIn } from '@/hooks/useRequireSignedIn'
import { styles } from '@/styles'
import { fetcher } from '@/utils'
type PostProps = {
  id: number
  title: string
  content: string
  createdAt: string
  status: string
  image: {
    url: string
  }
  audio: {
    url: string
  }
}

const CurrentPosts: NextPage = () => {
  useRequireSignedIn()
  const [user] = useUserState()
  const [, setSnackbar] = useSnackbarState()

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/posts'
  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)

  if (error) return <Error />
  if (!data) return <Loading />

  const posts: PostProps[] = camelcaseKeys(data)

  const handleDeletePost = async (postId: number) => {
    try {
      const deleteUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL + '/current/posts/' + postId

      const headers = {
        'access-token': localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        uid: localStorage.getItem('uid'),
      }
      await axios.delete(deleteUrl, { headers: headers })
      mutate(url)
      setSnackbar({
        message: '削除しました',
        severity: 'success',
        pathname: '/current/posts',
      })
    } catch (error) {
      setSnackbar({
        message: '削除に失敗しました',
        severity: 'error',
        pathname: '/current/posts',
      })
    }
  }

  return (
    <Box
      css={styles.pageMinHeight}
      sx={{
        borderTop: '0.5px solid #acbcc7',
        pb: 8,
        backgroundColor: '#E8F5E9',
      }}
    >
      <Container maxWidth="md" sx={{ pt: 6, px: 4 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: '2.0rem',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          投稿の管理
        </Typography>

        {posts.map((post, i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                minHeight: 80,
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: 194,
                  height: 194,
                  mr: { sm: 2 },
                  mb: { xs: 1, sm: 0 },
                }}
                image={post.image.url}
                alt="Post image"
              />
              <Box sx={{ width: 'auto', pr: 3, flexGrow: 1, ml: { sm: 2 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: { xs: 16, sm: 18 },
                      color: 'black',
                      fontWeight: 'bold',
                      mb: 1,
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Box
                    sx={{
                      fontSize: 12,
                      border: `1px solid ${
                        post.status === '下書き' ? '#9FAFBA' : '#3EA8FF'
                      }`,
                      p: '4px',
                      borderRadius: 1,
                      color: post.status === '下書き' ? '#9FAFBA' : '#3EA8FF',
                      fontWeight: 'bold',
                    }}
                  >
                    {post.status}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <audio controls>
                      <source src={post.audio.url} type="audio/mpeg" />
                      お使いのブラウザは音声ファイルをサポートしていません。
                    </audio>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Link href={'/current/posts/edit/' + post.id}>
                      <Tooltip title="編集する">
                        <IconButton sx={{ backgroundColor: '#F1F5FA' }}>
                          <EditIcon sx={{ color: '#99AAB6' }} />
                        </IconButton>
                      </Tooltip>
                    </Link>
                    <Avatar>
                      <DeleteDialog
                        onConfirm={() => handleDeletePost(post.id)}
                      />
                    </Avatar>
                  </Box>
                </Box>
              </Box>
            </Card>

            <Divider />
          </Box>
        ))}
      </Container>
    </Box>
  )
}

export default CurrentPosts
