import DeleteIcon from '@mui/icons-material/Delete'
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
} from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useUserState } from '@/hooks/useGlobalState'
import { useRequireSignedIn } from '@/hooks/useRequireSignedIn'
import { styles } from '@/styles'
import { fetcher } from '@/utils'

type PostProps = {
  id: number
  title: string
  image: {
    url: string
  }
  status: string
}

const CurrentPosts: NextPage = () => {
  useRequireSignedIn()
  const [user] = useUserState()

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/posts'
  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)

  if (error) return <Error />
  if (!data) return <Loading />

  const posts: PostProps[] = camelcaseKeys(data)

  return (
    <Box
      css={styles.pageMinHeight}
      sx={{
        borderTop: '0.5px solid #acbcc7',
        pb: 8,
      }}
    >
      <Container maxWidth="md" sx={{ pt: 6, px: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography component="h2" sx={{ fontSize: 32, fontWeight: 'bold' }}>
            投稿の管理
          </Typography>
        </Box>

        {posts.map((post: PostProps, i: number) => (
          <>
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: 80,
              }}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="194"
                  image={post.image.url}
                  alt="image"
                />
              </Card>
              <Box sx={{ width: 'auto', pr: 3 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: { xs: 16, sm: 18 },
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {post.title}
                </Typography>
              </Box>

              <Box
                sx={{
                  minWidth: 180,
                  width: 180,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <>
                  {post.status == '下書き' && (
                    <Box
                      sx={{
                        display: 'inline',
                        fontSize: 12,
                        textAlgin: 'center',
                        border: '1px solid #9FAFBA',
                        p: '4px',
                        borderRadius: 1,
                        color: '#9FAFBA',
                        fontWeight: 'bold',
                      }}
                    >
                      {post.status}
                    </Box>
                  )}
                  {post.status == '公開中' && (
                    <Box
                      sx={{
                        display: 'inline',
                        fontSize: 12,
                        textAlgin: 'center',
                        border: '1px solid #3EA8FF',
                        p: '4px',
                        borderRadius: 1,
                        color: '#3EA8FF',
                        fontWeight: 'bold',
                      }}
                    >
                      {post.status}
                    </Box>
                  )}
                </>
                <Box>
                  <Link href={'/current/posts/edit/' + post.id}>
                    <Avatar>
                      <Tooltip title="編集する">
                        <IconButton sx={{ backgroundColor: '#F1F5FA' }}>
                          <EditIcon sx={{ color: '#99AAB6' }} />
                        </IconButton>
                      </Tooltip>
                    </Avatar>
                  </Link>
                </Box>
                <Box>
                  <Avatar>
                    <Tooltip title="削除する">
                      <IconButton sx={{ backgroundColor: '#F1F5FA' }}>
                        <DeleteIcon sx={{ color: '#99AAB6' }} />
                      </IconButton>
                    </Tooltip>
                  </Avatar>
                </Box>
              </Box>
            </Box>
            <Divider />
          </>
        ))}
      </Container>
    </Box>
  )
}

export default CurrentPosts
