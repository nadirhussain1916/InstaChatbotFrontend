import React, { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  useTheme,
  useMediaQuery,
  Box,
  Avatar,
  Menu,
} from "@mui/material";
import { useGetPromptsQuery, useUpdatePromptsMutation } from "@/services/private/admin";
import { API_URL } from "@/utilities/constants";
import { setAnchorEl } from "@/store/slices/chatSlice";
import useAuth from "@/hooks/useAuth";
import { useAuthorizedQuery } from "@/services/private/auth";
import { useDispatch, useSelector } from "react-redux";
import { truncateUserName } from "@/utilities/helpers";

function EditPromptsForm() {
      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
     const { anchorEl,} = useSelector(state => state.chat);
     const dispatch = useDispatch();
     const openMenu = Boolean(anchorEl);
      const handleAvatarClick = e => dispatch(setAnchorEl(e.currentTarget));
      const { handleLogout } = useAuth();
      const { data } = useAuthorizedQuery();
       const handleMenuClose = () => dispatch(setAnchorEl(null));
        const handleAppLogout = () => {
          handleLogout();
          handleMenuClose();
          window.location.reload();
        };
  const { data: prompts = [] } = useGetPromptsQuery();
  const [updatePrompts, {isLoading}] = useUpdatePromptsMutation();
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    is_active: false,
  });

  // When prompts or selectedPromptId changes, update formData
  useEffect(() => {
    if (prompts.length && selectedPromptId !== null) {
      const prompt = prompts.find(p => p.id === selectedPromptId);
      if (prompt) {
        setFormData({
          name: prompt.name,
          content: prompt.content,
          is_active: prompt.is_active,
        });
      }
    }
  }, [prompts, selectedPromptId]);

  // Set first prompt as default selected on initial load
  useEffect(() => {
    if (prompts.length && selectedPromptId === null) {
      setSelectedPromptId(prompts[0].id);
    }
  }, [prompts, selectedPromptId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = {
      name: formData.name,
      content: formData.content,
      is_active: formData.is_active,
    };
    const finalPayload = {
        ...payload,
        id: selectedPromptId,
    }
 await updatePrompts(finalPayload);
  };

  return (
     <><Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={isMobile ? 2 : 3}
          sx={{
              background: '#ffffff',
              borderBottom: '1px solid rgba(177, 59, 255, 0.1)',
          }}
      >
          <Typography
              variant="h6"
              sx={{
                  fontWeight: 600,
                  color: '#090040',
                  fontSize: '1.25rem',
              }}
          >
              Wellcome to Daily Bread Admin Panel
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                  src={`${API_URL}${data?.profile_pic}`}
                  sx={{
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      border: '2px solid #B13BFF',
                  }}
                  onClick={handleAvatarClick} />
              <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  PaperProps={{
                      sx: {
                          background: '#ffffff',
                          border: '1px solid rgba(177, 59, 255, 0.1)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 16px rgba(9, 0, 64, 0.1)',
                      }
                  }}
              >
                  <MenuItem
                      onClick={handleAppLogout}
                      sx={{
                          color: '#090040',
                          '&:hover': {
                              background: 'rgba(177, 59, 255, 0.08)',
                          }
                      }}
                  >
                      Logout
                  </MenuItem>
              </Menu>
              {!isMobile && (
                  <Chip
                      label={truncateUserName(data?.full_name || data?.username)}
                      sx={{
                          background: 'rgba(177, 59, 255, 0.1)',
                          color: '#471396',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(177, 59, 255, 0.2)',
                      }} />
              )}
          </Box>
      </Box><Paper sx={{ maxWidth: 900, margin: "auto", padding: 4 }}>
              <Typography variant="h5" mb={3} fontWeight="bold" textAlign="center">
                  Edit Your Existing Prompts
              </Typography>

              {/* Prompt Selector */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="select-prompt-label">Select Prompt</InputLabel>
                  <Select
                      labelId="select-prompt-label"
                      value={selectedPromptId || ""}
                      label="Select Prompt"
                      onChange={(e) => setSelectedPromptId(Number(e.target.value))}
                  >
                      {prompts.map((prompt) => (
                          <MenuItem key={prompt.id} value={prompt.id}>
                              {prompt.name}
                          </MenuItem>
                      ))}
                  </Select>
              </FormControl>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                  <TextField
                      label="Name"
                      name="name"
                      fullWidth
                      value={formData.name}
                      onChange={handleChange}
                      sx={{ mb: 3 }} />
                  <TextField
                      label="Content"
                      name="content"
                      fullWidth
                      multiline
                      minRows={6}
                      value={formData.content}
                      onChange={handleChange}
                      sx={{ mb: 3 }} />
                  <FormControlLabel
                      control={<Switch
                          checked={formData.is_active}
                          onChange={handleChange}
                          name="is_active"
                          color="primary" />}
                      label="Active"
                      sx={{ mb: 3 }} />
                  <Box className='d-flex items-center gap-2'>
                  <Button variant="contained" color="primary" type="submit">
                      {isLoading ? 'Submiting..' : 'Save Changes'}
                  </Button>
                  <Button variant="contained" color="primary" onClick={Navigate('/')}>
                      Back to home Page
                  </Button>
                  </Box>
              </form>
          </Paper></>
  );
}

export default EditPromptsForm;
