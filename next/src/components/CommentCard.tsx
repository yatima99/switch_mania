import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DeleteIcon from '@mui/icons-material/Delete'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

type CommentCardProps = {
  content: string
  userName: string
  userAvatar: string
  createdAt: string
  onDelete: () => void
  showDeleteButton: boolean
}

const CommentCard = ({
  content,
  userName,
  userAvatar,
  createdAt,
  onDelete,
  showDeleteButton,
}: CommentCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '24px',
        margin: '12px auto',
        maxWidth: 900,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'flex-start' }}>
        <Avatar
          src={userAvatar}
          alt={userName}
          sx={{ marginRight: '16px', width: 56, height: 56 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                marginRight: '16px',
                fontSize: '1.1rem',
              }}
            >
              {userName}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}
            >
              <AccessTimeIcon fontSize="small" sx={{ marginRight: '4px' }} />
              {createdAt}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
            {content}
          </Typography>{' '}
        </Box>
      </Box>
      {showDeleteButton && (
        <IconButton
          onClick={onDelete}
          color="secondary"
          sx={{ marginLeft: 'auto', marginRight: '12px' }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Card>
  )
}

export default CommentCard
