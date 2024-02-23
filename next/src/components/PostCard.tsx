import { Box, Card, CardContent, Typography, Chip, Avatar } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'

type PostCardProps = {
  title: string
  userName: string
  avatar_url: string
  image_url: string
  tags: { name: string }[]
}

const omit = (text: string) => (len: number) => (ellipsis: string) =>
  text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text

const PostCard = (props: PostCardProps) => {
  return (
    <Card
      sx={{
        height: 310,
        m: 1,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardMedia
        component="img"
        image={props.image_url}
        alt="thumbnail"
        sx={{
          width: '100%',
          height: 200,
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography
          component="h3"
          sx={{
            mb: 1,
            fontSize: 16,
            fontWeight: 'bold',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {omit(props.title)(45)('...')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            src={props.avatar_url}
            alt="User Avatar"
            sx={{ width: 24, height: 24, mr: 0.5 }}
          />
          <Typography variant="body2" sx={{ fontSize: 12 }}>
            {props.userName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            overflow: 'hidden',
          }}
        >
          {props.tags.map((tag, index) => (
            <Chip key={index} label={tag.name} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default PostCard
