import {
  Box,
  Grid,
  Container,
  Pagination,
  Autocomplete,
  TextField,
  Typography,
} from '@mui/material'

import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import PostCard from '@/components/PostCard'
import { styles } from '@/styles'

type PostProps = {
  id: number
  title: string
  createdAt: string
  image: {
    url: string
  }
  tags: string[]
  user: {
    name: string
  }
}

const Index: NextPage = () => {
  const router = useRouter()
  const page = 'page' in router.query ? Number(router.query.page) : 1

  const [tag, setTag] = useState('')
  const [tagOptions, setTagOptions] = useState<string[]>([])
  const tagQuery = router.query.tag
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
      const tagNames = tagsData.map((tag) => tag.name)
      setTagOptions(tagNames)
    }
  }, [tagsData])

  const { data, error } = useSWR(url, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />
  if (tagsError) return <Error />

  const posts = camelcaseKeys(data.posts)
  const meta = camelcaseKeys(data.meta)

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
    <Box css={styles.pageMinHeight} sx={{ backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Autocomplete
            freeSolo
            options={tagOptions}
            value={tag}
            onChange={(event, newValue) => setTag(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="タグで絞り込み"
                onKeyDown={handleKeyPress}
              />
            )}
            sx={{ flexGrow: 1, mr: 1 }}
          />
        </Box>

        {posts.length > 0 ? (
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
  )
}

export default Index
