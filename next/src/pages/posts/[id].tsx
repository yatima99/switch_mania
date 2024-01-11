import ArticleIcon from '@mui/icons-material/Article'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import PersonIcon from '@mui/icons-material/Person'
import {
  Box,
  Container,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import CommentCard from '@/components/CommentCard'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useSnackbarState, useUserState } from '@/hooks/useGlobalState'
import { fetcher } from '@/utils'

type CommentProps = {
  id: number
  user: {
    name: string
  }
  content: string
  created_at: string
}

type PostProps = {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  image: {
    url: string
  }
  user: {
    name: string
  }
  comments: CommentProps[]

  like_id: number
  liked: boolean
}

const PostDetail: NextPage = () => {
  const [user] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/posts/'
  const { id } = router.query
  const { data, error } = useSWR(id ? url + id : null, fetcher)

  const [liked, setLiked] = useState(false)
  const [likeId, setLikeId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<CommentProps[]>([])

  useEffect(() => {
    if (data) {
      setLiked(data.liked)
      setLikeId(data.like_id)
      setComments(data.comments || [])
      console.log(data.comments)
    }
  }, [data])

  if (error) return <Error />
  if (!data) return <Loading />
  const post: PostProps = camelcaseKeys(data, { deep: true })

  const isLoggedIn = () => {
    return user && user.isSignedIn
  }
  const handleLikeClick = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    const likeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/posts/${post.id}/likes`
    const unlikeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/likes/${likeId}`
    let response
    try {
      if (liked) {
        await axios.delete(unlikeUrl, { headers: headers })
        setLikeId(null)
        setSnackbar({
          message: 'いいねを取り消しました',
          severity: 'success',
          pathname: '/posts/[id]',
        })
      } else {
        response = await axios.post(likeUrl, {}, { headers: headers })
        setSnackbar({
          message: 'いいねしました',
          severity: 'success',
          pathname: '/posts/[id]',
        })
        setLikeId(response.data.id)
      }
      setLiked(!liked)
    } catch (err) {
      console.error(err)
      setSnackbar({
        message: '操作に失敗しました',
        severity: 'error',
        pathname: '/posts/[id]',
      })
    }
  }
  const postCommentUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/posts/${post.id}/comments`

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      return
    }

    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    try {
      const response = await axios.post(
        postCommentUrl,
        { comment: { content: commentText } },
        { headers: headers },
      )

      if (response.data && response.data.id) {
        setComments((prevComments) => [
          ...prevComments,
          {
            id: response.data.id,
            user: { name: user.name },
            content: commentText,
            created_at: response.data.created_at,
          },
        ])
      }
      console.log(response.data)

      setSnackbar({
        message: 'コメントを投稿しました',
        severity: 'success',
        pathname: '/posts/[id]',
      })
      mutate(postCommentUrl, true)
      setCommentText('')
    } catch (err) {
      console.error(err)
      setSnackbar({
        message: 'コメントの投稿に失敗しました',
        severity: 'error',
        pathname: '/posts/[id]',
      })
    }
  }

  const handleCommentDelete = async (postId, commentId) => {
    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/posts/${postId}/comments/${commentId}`,
        { headers },
      )
      setComments(comments.filter((comment) => comment.id !== commentId))
      setSnackbar({
        message: 'コメントを削除しました',
        severity: 'success',
        pathname: '/posts/[id]',
      })
    } catch (error) {
      console.error(error)
      setSnackbar({
        message: 'コメントの削除に失敗しました',
        severity: 'error',
        pathname: '/posts/[id]',
      })
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        pb: 6,
        minHeight: 'calc(100vh - 57px)',
      }}
    >
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          alignItems: 'center',
          backgroundColor: 'white',
          borderTop: '0.5px solid #acbcc7',
          height: 56,
          pl: 4,
          color: '#6e7b85',
        }}
      >
        <Box sx={{ pr: 1 }}>
          <PersonIcon />
        </Box>
        <Box sx={{ mr: 2 }}>
          <Typography component="p">投稿者:</Typography>
        </Box>
        <Typography component="p" sx={{ fontWeight: 'bold', color: 'black' }}>
          {post.user.name}
        </Typography>
      </Box>
      <Container maxWidth="lg">
        <Box sx={{ pt: 6, pb: 3 }}>
          <Box sx={{ maxWidth: 840, m: 'auto', textAlign: 'center' }}>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 21, sm: 25 },
                fontWeight: 'bold',
              }}
            >
              {post.title}
            </Typography>
          </Box>
          <Typography
            component="p"
            align="center"
            sx={{
              display: {
                xs: 'block',
                lg: 'none',
              },
              color: '#6e7b85',
              mt: '20px',
            }}
          >
            {post.createdAt}に公開
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '0 24px' }}>
          <Box sx={{ width: '100%' }}>
            <Card
              sx={{
                boxShadow: 'none',
                borderRadius: '12px',
                maxWidth: 840,
                m: '0 auto',
              }}
            >
              <CardMedia
                component="img"
                height="394"
                image={post.image.url}
                alt="Pa"
              />
              <Box
                sx={{
                  padding: { xs: '0 24px 24px 24px', sm: '0 40px 40px 40px' },
                  marginTop: { xs: '24px', sm: '40px' },
                }}
              ></Box>
            </Card>
            <Card
              sx={{
                boxShadow: 'none',
                borderRadius: '12px',
                maxWidth: 840,
                m: '0 auto',
              }}
            >
              <Box
                sx={{
                  padding: { xs: '0 24px 24px 24px', sm: '0 40px 40px 40px' },
                  marginTop: { xs: '24px', sm: '40px' },
                }}
              >
                {post.content}
              </Box>
            </Card>

            <Box
              sx={{
                padding: { xs: '0 24px 24px 24px', sm: '0 40px 40px 40px' },
                marginTop: { xs: '24px', sm: '40px' },
              }}
            >
              {comments.map((comment) => (
                <Card key={comment.id} variant="outlined">
                  <CommentCard
                    content={comment.content}
                    userName={comment.user.name}
                    createdAt={comment.created_at}
                    onDelete={() => handleCommentDelete(post.id, comment.id)}
                    showDeleteButton={user && user.name === comment.user.name}
                  />
                </Card>
              ))}
            </Box>

            {isLoggedIn() && (
              <Box sx={{ my: 4 }}>
                <TextField
                  fullWidth
                  label="コメント"
                  variant="outlined"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCommentSubmit}
                  sx={{ mt: 2 }}
                >
                  コメントを投稿
                </Button>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
              width: 300,
              minWidth: 300,
            }}
          >
            <Card sx={{ boxShadow: 'none', borderRadius: '12px' }}>
              <List sx={{ color: '#6e7b85' }}>
                <ListItem divider>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ pr: 1 }}>
                        <PersonIcon />
                      </Box>
                      <ListItemText primary="投稿者" />
                    </Box>
                    <Box>
                      <ListItemText primary={post.user.name} />
                    </Box>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ pr: 1 }}>
                        <ArticleIcon />
                      </Box>
                      <ListItemText primary="公開" />
                    </Box>
                    <Box>
                      <ListItemText primary={post.createdAt} />
                    </Box>
                  </Box>
                </ListItem>
              </List>
            </Card>
            <Box>
              いいねする
              <IconButton onClick={handleLikeClick}>
                {liked ? (
                  <FavoriteIcon style={{ color: 'red' }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default PostDetail
