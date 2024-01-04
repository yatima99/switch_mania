import { Box, Container, Grid, Typography } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import PostCard from '@/components/PostCard'
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
  tags: string[]
}

const LikesPosts: NextPage = () => {
  useRequireSignedIn()
  const [user] = useUserState()

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/liked_posts'
  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)

  if (error) return <Error />
  if (!data) return <Loading />

  const posts: PostProps[] = camelcaseKeys(data)

  return (
    <>
      <Box sx={{ pt: 6, px: 18, backgroundColor: '#ffffff' }}>
        <Typography component="h2" sx={{ fontSize: 32, fontWeight: 'bold' }}>
          いいねした投稿一覧
        </Typography>
      </Box>

      <Box css={styles.pageMinHeight} sx={{ backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="md" sx={{ pt: 6 }}>
          <Grid container spacing={4}>
            {posts.map((post: PostProps, i: number) => (
              <Grid key={i} item xs={6} md={4}>
                <Link href={'/posts/' + post.id}>
                  <PostCard
                    title={post.title}
                    userName={post.user.name}
                    image_url={post.image.url}
                    tags={post.tags}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default LikesPosts
