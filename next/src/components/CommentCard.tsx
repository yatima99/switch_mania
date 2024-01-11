import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

type CommentCardProps = {
  content: string
  userName: string
  createdAt: string
  onDelete: () => void
  showDeleteButton: boolean
}

const CommentCard = ({
  content,
  userName,
  createdAt,
  onDelete,
  showDeleteButton,
}: CommentCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', padding: '12px' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <Avatar
          alt="User Avatar"
          src="https://via.placeholder.com/40"
          sx={{ width: 40, height: 40, marginRight: '12px' }}
        />
        <Typography variant="body1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          {userName}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <AccessTimeIcon fontSize="small" sx={{ marginRight: '4px' }} />
          {createdAt}
        </Typography>
      </Box>
      <Typography variant="body2">{content}</Typography>
      {showDeleteButton && (
        <Button onClick={onDelete} color="secondary">
          削除
        </Button>
      )}
    </Card>
  )
}

export default CommentCard
