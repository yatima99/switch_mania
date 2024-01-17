import { Box, Card, CardContent, Typography, Chip, Avatar } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'

type PostCardProps = {
  title: string
  userName: string
  avatar_url: string
  image_url: string
  tags: string[]
}

const omit = (text: string) => (len: number) => (ellipsis: string) =>
  text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text
const PostCard = (props: PostCardProps) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="194"
        image={props.image_url}
        alt="Pa"
      />
      <CardContent>
        <Typography
          component="h3"
          sx={{
            mb: 2,
            minHeight: 48,
            fontSize: 16,
            fontWeight: 'bold',
            lineHeight: 1.5,
          }}
        >
          {omit(props.title)(45)('...')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={props.avatar_url}
            alt="User Avatar"
            sx={{ width: 30, height: 30, mr: 1 }}
          />
          <Typography sx={{ fontSize: 12 }}>{props.userName}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
          {props.tags.map((tag, index) => (
            <Chip key={index} label={tag.name} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default PostCard
