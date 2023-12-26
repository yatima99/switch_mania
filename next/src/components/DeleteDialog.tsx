import DeleteIcon from '@mui/icons-material/Delete'
import { Button, IconButton, Tooltip } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import * as React from 'react'

interface DeleteDialogProps {
  onConfirm: () => void
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ onConfirm }) => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <>
      <Tooltip title="削除する">
        <IconButton
          sx={{ backgroundColor: '#F1F5FA' }}
          onClick={handleClickOpen}
        >
          <DeleteIcon sx={{ color: '#99AAB6' }} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'本当に削除しますか?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default DeleteDialog
