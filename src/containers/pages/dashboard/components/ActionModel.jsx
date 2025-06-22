import React from 'react'
import { Box, Button, FormControlLabel, FormLabel, Modal, RadioGroup, TextField, Typography } from '@mui/material'

function ActionModel() {
  return (
    <Modal open={openModal} onClose={handleModalClose}>
  <Box
    sx={{
      bgcolor: 'white',
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
      width: 320,
      mx: 'auto',
      mt: '10%',
    }}
  >
    <Typography variant="h6" mb={2}>Create Carousel</Typography>

    <TextField
      fullWidth
      label="Number of Slides"
      variant="outlined"
      value={numSlides}
      onChange={e => setNumSlides(e.target.value)}
      sx={{ mb: 3 }}
    />

    <FormLabel>Inspiration:</FormLabel>
    <RadioGroup
      row
      value={inspiration}
      onChange={e => setInspiration(e.target.value)}
      sx={{ mb: 3 }}
    >
      <FormControlLabel value="Post" control={<Radio />} label="Post" />
      <FormControlLabel value="PostLink" control={<Radio />} label="PostLink" />
    </RadioGroup>

    <Box display="flex" justifyContent="flex-end" gap={2}>
      <Button variant="outlined" onClick={handleModalClose}>Cancel</Button>
      <Button variant="contained" onClick={handleModalClose}>Create</Button>
    </Box>
  </Box>
</Modal>

  )
}

export default ActionModel
