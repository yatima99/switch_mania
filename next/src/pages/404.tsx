import { Card, CardContent, Container } from '@mui/material'

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 3, mt: 8, backgroundColor: '#EEEEEE' }}>
        <CardContent sx={{ lineHeight: 2 }}>
          お探しになったページは存在しません｡ <br />
        </CardContent>
      </Card>
    </Container>
  )
}

export default NotFound
