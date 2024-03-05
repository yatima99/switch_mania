import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Grid,
  Container,
  Pagination,
  Autocomplete,
  TextField,
  Typography,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import PostCard from '@/components/PostCard'
import { useUserState } from '@/hooks/useGlobalState'
import { styles } from '@/styles'

type Tag = {
  id: string
  name: string
}

type PostProps = {
  id: number
  title: string
  createdAt: string
  image: {
    url: string
  }
  tags: { name: string }[]
  user: {
    name: string
    image: {
      url: string
    }
  }
}

const Index: NextPage = () => {
  const [user] = useUserState()
  const router = useRouter()
  const page = 'page' in router.query ? Number(router.query.page) : 1

  const [tag, setTag] = useState('')
  const [tagOptions, setTagOptions] = useState<string[]>([])
  const [recommendedPosts, setRecommendedPosts] = useState<PostProps[]>([])
  const tagQuery = Array.isArray(router.query.tag)
    ? `&tag=${encodeURIComponent(router.query.tag[0])}`
    : router.query.tag
      ? `&tag=${encodeURIComponent(router.query.tag)}`
      : ''
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/?page=${page}${tagQuery}`
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data: tagsData, error: tagsError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags`,
    fetcher,
  )

  useEffect(() => {
    if (tagsData) {
      const tagNames = tagsData.map((tag: Tag) => tag.name)
      setTagOptions(tagNames)
    }
  }, [tagsData])

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid'),
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/recommended_posts`,
          { headers },
        )

        setRecommendedPosts(camelcaseKeys(response.data))
      } catch (error) {
        console.error('Error fetching recommended posts:', error)
      }
    }

    fetchRecommendedPosts()
  }, [])

  const { data, error } = useSWR(url, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />
  if (tagsError) return <Error />

  const posts = camelcaseKeys(data.posts)
  const meta = camelcaseKeys(data.meta)

  const isLoggedIn = () => {
    return user && user.isSignedIn
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push('/?page=' + value)
  }

  const handleTagSearch = () => {
    if (tag) {
      router.push(`/?page=1&tag=${encodeURIComponent(tag)}`)
    } else {
      router.push('/')
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleTagSearch()
    }
  }

  return (
    <>
      <Head>
        <title>打鍵音投稿サイト | Switch Mania</title>
      </Head>
      <Box css={styles.pageMinHeight} sx={{ backgroundColor: '#E8F5E9' }}>
        <Container maxWidth="md" sx={{ pt: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Autocomplete
              freeSolo
              options={tagOptions}
              value={tag}
              onChange={(event, newValue) => setTag(newValue ?? '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="スイッチの種類（タグ）で絞り込み"
                  onKeyDown={handleKeyPress}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTagSearch} edge="end">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              sx={{ flexGrow: 1, mr: 1 }}
            />
          </Box>

          {isLoggedIn() && recommendedPosts.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                おすすめの投稿
              </Typography>
              <Grid container spacing={4}>
                {recommendedPosts.map((post) => (
                  <Grid key={post.id} item xs={6} md={4}>
                    <Link href={'/posts/' + post.id}>
                      <PostCard
                        title={post.title}
                        userName={post.user.name}
                        avatar_url={post.user.image.url}
                        image_url={post.image.url}
                        tags={post.tags}
                      />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {posts.length > 0 ? (
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={1}>
                {posts.map((post: PostProps) => (
                  <Grid key={post.id} item xs={6} md={4}>
                    <Link href={'/posts/' + post.id}>
                      <PostCard
                        title={post.title}
                        userName={post.user.name}
                        avatar_url={post.user.image.url}
                        image_url={post.image.url}
                        tags={post.tags}
                      />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>検索結果はありません</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <Pagination
              count={meta.totalPages}
              page={meta.currentPage}
              onChange={handleChange}
            />
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Index
