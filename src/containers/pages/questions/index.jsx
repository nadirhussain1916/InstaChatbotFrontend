/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup
} from '@mui/material';
import {
  ChevronRight,
  ChevronLeft,
  Add,
  Close,
  Check,
  Instagram,
  CameraAlt,
  Favorite,
  Send,
  MenuBook,
  TrendingUp,
  People,
  Star,
  EmojiEvents,
  FlashOn,
  GpsFixed,
  Message,
  Event,
  Link,
  Settings,
  Upload,
  Image,
  VideoLibrary,
  Edit,
  Share,
  Language,
  Mail,
  Phone,
  LocationOn,
  Schedule,
  Bookmark,
  ThumbUp,
  Person,
  Business
} from '@mui/icons-material';
import { useAddQuestionMutation } from '@/services/private/questions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserDetail } from "@/store/slices/authSlice";
import { useAuthorizedQuery } from '@/services/private/auth';
import { truncateUserName } from '@/utilities/helpers';

function Questions() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitQuestion] = useAddQuestionMutation();
  const { data } = useAuthorizedQuery();
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    helpWith: [],
    brandName: '',
    brandType: '',
    industry: '',
    helpDescription: '',
    website: '',
    offers: [],
    voiceTone: [],
    postLength: 'medium',
    originStory: '',
    challenges: '',
    wins: '',
    testimonials: '',
    connections: [],
    consent: false,
    additionalFeatures: ''
  });

  const helpOptions = [
    {
      text: 'Growing your audience on Instagram with the right people',
      icon: <People />
    },
    {
      text: 'Selling your offers (without the ick)',
      icon: <TrendingUp />
    },
    {
      text: 'Creating for Instagram (minus the burnout)',
      icon: <CameraAlt />
    },
    {
      text: 'Writing better emails (so your list doesn\'t forget you exist)',
      icon: <Mail />
    },
    {
      text: 'Honestly? All of the above',
      icon: <Star />
    }
  ];

  const voiceOptions = [
    { text: 'Direct', icon: <GpsFixed /> },
    { text: 'Warm', icon: <Favorite /> },
    { text: 'Punchy', icon: <FlashOn /> },
    { text: 'Educational', icon: <MenuBook /> },
    { text: 'Bold', icon: <EmojiEvents /> },
    { text: 'Professional', icon: <Settings /> },
    { text: 'Story-driven', icon: <Message /> },
    { text: 'Playful', icon: <CameraAlt /> },
    { text: 'No-fluff', icon: <Edit /> }
  ];

  const connectionOptions = [
    {
      text: 'Your photo album (so I can suggest visuals that match your post)',
      icon: <Image />
    },
    {
      text: 'Canva (for designing carousels and Reels covers without the guesswork)',
      icon: <Edit />
    },
    {
      text: 'Your scheduler (Later, Metricool you pick and LMK if you want my affiliate link)',
      icon: <Event />
    },
    {
      text: 'Your calendar (Google, Notion, ClickUp — whatever you live inside)',
      icon: <Schedule />
    }
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMultiSelect = (field, value, maxSelection) => {
    const currentValues = formData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : maxSelection && currentValues.length >= maxSelection
        ? currentValues
        : [...currentValues, value];

    setFormData({ ...formData, [field]: newValues });
  };

  const addOffer = () => {
    const newOffer = {
      id: Date.now().toString(),
      name: '',
      priceModel: '',
      transformation: ''
    };
    setFormData({
      ...formData,
      offers: [...formData.offers, newOffer]
    });
  };

  const updateOffer = (id, field, value) => {
    setFormData({
      ...formData,
      offers: formData.offers.map(offer =>
        offer.id === id ? { ...offer, [field]: value } : offer
      )
    });
  };

  const removeOffer = id => {
    setFormData({
      ...formData,
      offers: formData.offers.filter(offer => offer.id !== id)
    });
  };

  const generateOutput = () => {
    const answers = [
      { question: "What's your first name?", answer: formData.firstName },
      { question: "What do you want help with most?", answer: formData.helpWith.join(', ') },
      { question: "What is your brand or business name?", answer: formData.brandName },
      { question: "Are you a personal brand or a product-based business?", answer: formData.brandType },
      { question: "What industry or niche are you in?", answer: formData.industry },
      { question: "In one sentence, what do you help people do?", answer: formData.helpDescription },
      { question: "Have a website? Brand doc? Sales page?", answer: formData.website },
      { question: "Your offers", answer: formData.offers.map(offer => `${offer.name} (${offer.priceModel}) - ${offer.transformation}`).join('; ') },
      { question: "Voice tone", answer: formData.voiceTone.join(', ') },
      { question: "Default post length", answer: formData.postLength },
      { question: "How did this all start? What pushed you to build your business?", answer: formData.originStory },
      { question: "What challenges have you overcome along the way?", answer: formData.challenges },
      { question: "What's gone right? This is your moment!", answer: formData.wins },
      { question: "Your testimonials", answer: formData.testimonials },
      { question: "What would you like to connect?", answer: formData.connections.join(', ') },
      { question: "Do you consent to connect these?", answer: formData.consent ? 'Yes' : 'No' },
      { question: "Are there any other features you WISH we would add?", answer: formData.additionalFeatures }
    ].filter(item => item.answer && item.answer !== '' && item.answer !== 'No');

    return { answers };
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Box className="text-center">
            <Box className="d-flex justify-content-center mb-4">
              <Box className="position-relative">
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #fbbf24 0%, #ef4444 50%, #8b5cf6 100%)',
                    borderRadius: '50%',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Instagram sx={{ fontSize: 40, color: '#8b5cf6' }} />
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -8,
                    right: -8,
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FlashOn sx={{ fontSize: 16, color: 'white' }} />
                </Box>
              </Box>
            </Box>

            <Typography variant="h2" className="fw-bold mb-4" sx={{ 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
               hello {truncateUserName(data?.full_name || data?.username)}
            </Typography>
            <Typography variant="h5" className="text-muted mb-3">
              I am your new content partner <Typography component="span" sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Daily Bread</Typography>.
            </Typography>
            <Typography variant="h6" className="text-muted mb-3">
              You can call me Daily or DB.
            </Typography>
            <Typography variant="body1" className="text-dark mb-4">
              I am excited to help you craft content that is anything but generic.
            </Typography>
            <Box className="d-flex align-items-center justify-content-center mb-4">
              <Typography variant="h4" className="me-2">👉</Typography>
              <Typography variant="body1" sx={{ 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'medium'
              }}>
                Hit next and let's begin, shall we?
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              startIcon={<Favorite />}
              endIcon={<ChevronRight />}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                borderRadius: '50px',
                py: 2,
                px: 4,
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ea580c 100%)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              I'm ready
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box className="text-center mb-4">
              <Box className="d-flex justify-content-center mb-3">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <People sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h3" className="fw-bold text-dark">Who are you?</Typography>
            </Box>

            <Box className="mb-4">
              <Box className="d-flex align-items-center mb-2">
                <Edit sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                <Typography variant="h6" className="fw-medium">
                  First, what's your first name?
                </Typography>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter your first name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: 'white'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white'
                    }
                  }
                }}
              />
            </Box>

            <Box className="mb-4">
              <Box className="d-flex align-items-center mb-2">
                <GpsFixed sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                <Typography variant="h6" className="fw-medium">
                  Second, what do you want help with most?
                </Typography>
              </Box>
              <Box className="d-flex align-items-center mb-3">
                <Message sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                <Typography variant="body2" className="text-muted">
                  (We'll remember this so we can tailor content for you.)
                </Typography>
              </Box>
              <Box className="d-grid gap-3">
                {helpOptions.map(option => (
                  <Button
                    key={option.text}
                    variant={formData.helpWith.includes(option.text) ? "contained" : "outlined"}
                    onClick={() => handleMultiSelect('helpWith', option.text)}
                    startIcon={option.icon}
                    endIcon={formData.helpWith.includes(option.text) ? <Check /> : null}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      py: 2,
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      ...(formData.helpWith.includes(option.text) 
                        ? {
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)'
                            }
                          }
                        : {
                            borderColor: '#8b5cf6',
                            color: '#8b5cf6',
                            // '&:hover': {
                            //   borderColor: '#7c3aed',
                            //   backgroundColor: '#f3f4f6'
                            // }
                          })
                    }}
                  >
                    {option.text}
                  </Button>
                ))}
              </Box>
            </Box>

            {formData.helpWith.length > 0 && (
              <Box className="d-flex justify-content-end">
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ChevronRight />}
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                    borderRadius: '50px',
                    py: 1.5,
                    px: 3,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ea580c 100%)'
                    }
                  }}
                >
                  Next
                </Button>
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Box className="text-center mb-4">
              <Box className="d-flex justify-content-center mb-3">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Star sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h3" className="fw-bold text-dark mb-3">Your brand at a glance</Typography>
              <Typography variant="body1" className="text-muted mb-3">
                Now let's make sure everything is right okay? Answer a few quick questions so your posts and emails actually sound like you and not some weird AI trying to wing it. I will not name names, but we know who I'm talking about…
              </Typography>
            </Box>

            <Box className="row g-4 mb-4">
              <Box className="col-12">
                <Box className="d-flex align-items-center mb-2">
                  <EmojiEvents sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" className="fw-medium">
                    What is your brand or business name?
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.brandName}
                  onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="Enter your brand name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      '&:hover': { backgroundColor: 'white' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }
                  }}
                />
              </Box>

              <Box className="col-12">
                <Box className="d-flex align-items-center mb-2">
                  <People sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" className="fw-medium">
                    Are you a personal brand or a product-based business?
                  </Typography>
                </Box>
                <FormControl fullWidth>
                  <Select
                    value={formData.brandType}
                    onChange={e => setFormData({ ...formData, brandType: e.target.value })}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      '&:hover': { backgroundColor: 'white' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }}
                  >
                    <MenuItem value="">Select brand type</MenuItem>
                    <MenuItem value="personal">Personal Brand</MenuItem>
                    <MenuItem value="product">Product-Based Business</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box className="col-12">
                <Box className="d-flex align-items-center mb-2">
                  <GpsFixed sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" className="fw-medium">
                    What industry or niche are you in?
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., parenting coach, jewelry brand, Pilates app"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      '&:hover': { backgroundColor: 'white' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }
                  }}
                />
              </Box>

              <Box className="col-12">
                <Box className="d-flex align-items-center mb-2">
                  <Favorite sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" className="fw-medium">
                    In one sentence, what do you help people do?
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.helpDescription}
                  onChange={e => setFormData({ ...formData, helpDescription: e.target.value })}
                  placeholder="e.g., I help new moms get their babies to sleep without cry-it-out"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      '&:hover': { backgroundColor: 'white' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }
                  }}
                />
              </Box>

              <Box className="col-12">
                <Box className="d-flex align-items-center mb-2">
                  <Language sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" className="fw-medium">
                    Have a website? Brand doc? Sales page?
                  </Typography>
                </Box>
                <Box className="d-flex align-items-center mb-2">
                  <Link sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                  <Typography variant="body2" className="text-muted">
                    Drop it in so I can pull from your own words. Upload away (don't hold back here).
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      '&:hover': { backgroundColor: 'white' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }
                  }}
                />
              </Box>
            </Box>

            <Box className="d-flex justify-content-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                startIcon={<ChevronLeft />}
                sx={{
                  borderRadius: '50px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderColor: '#6c757d',
                  color: '#6c757d',
                  // '&:hover': {
                  //   borderColor: '#495057',
                  //   backgroundColor: '#f8f9fa'
                  // }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ChevronRight />}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                  borderRadius: '50px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ea580c 100%)'
                  }
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Box className="text-center mb-4">
              <Box className="d-flex justify-content-center mb-3">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <TrendingUp sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h3" className="fw-bold text-dark mb-3">Your offers</Typography>
              <Typography variant="body1" className="text-muted mb-3">
                Let's talk about what you're actually selling now because that's what we'll be writing about.
              </Typography>
              <Box className="d-flex align-items-center justify-content-center">
                <Bookmark sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                <Typography variant="body2" className="text-muted">
                  Add one, add them all. You can always come back and update later.
                </Typography>
              </Box>
            </Box>

            <Box className="mb-4">
              {formData.offers.map(offer => (
                <Card key={offer.id} className="mb-3" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Box className="d-flex justify-content-between align-items-start mb-3">
                      <Box className="d-flex align-items-center">
                        <Star sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                        <Typography variant="h6" className="fw-bold">Offer Details</Typography>
                      </Box>
                      <IconButton
                        onClick={() => removeOffer(offer.id)}
                        sx={{ color: '#dc3545' }}
                      >
                        <Close />
                      </IconButton>
                    </Box>

                    <Box className="row g-3">
                      <Box className="col-12">
                        <Box className="d-flex align-items-center mb-2">
                          <GpsFixed sx={{ fontSize: 16, color: '#8b5cf6', mr: 1 }} />
                          <Typography variant="subtitle2" className="fw-medium">
                            What are you selling?
                          </Typography>
                        </Box>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={offer.name}
                          onChange={e => updateOffer(offer.id, 'name', e.target.value)}
                          placeholder="e.g., 1:1 coaching, course, sleep program, physical product"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#f8f9fa',
                              '&:hover': { backgroundColor: 'white' },
                              '&.Mui-focused': { backgroundColor: 'white' }
                            }
                          }}
                        />
                      </Box>

                      <Box className="col-12">
                        <Box className="d-flex align-items-center mb-2">
                          <TrendingUp sx={{ fontSize: 16, color: '#8b5cf6', mr: 1 }} />
                          <Typography variant="subtitle2" className="fw-medium">
                            What is the price or pricing model?
                          </Typography>
                        </Box>
                        <Box className="d-flex gap-2">
                          {['one-time', 'monthly', 'subscription'].map(model => (
                            <Button
                              key={model}
                              variant={offer.priceModel === model ? "contained" : "outlined"}
                              onClick={() => updateOffer(offer.id, 'priceModel', model)}
                              size="small"
                              sx={{
                                borderRadius: '50px',
                                textTransform: 'none',
                                ...(offer.priceModel === model 
                                  ? {
                                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                      color: 'white'
                                    }
                                  : {
                                      borderColor: '#8b5cf6',
                                      color: '#8b5cf6'
                                    })
                              }}
                            >
                              {model.charAt(0).toUpperCase() + model.slice(1)}
                            </Button>
                          ))}
                        </Box>
                      </Box>

                      <Box className="col-12">
                        <Box className="d-flex align-items-center mb-2">
                          <FlashOn sx={{ fontSize: 16, color: '#8b5cf6', mr: 1 }} />
                          <Typography variant="subtitle2" className="fw-medium">
                            What transformation does it promise?
                          </Typography>
                        </Box>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={offer.transformation}
                          onChange={e => updateOffer(offer.id, 'transformation', e.target.value)}
                          placeholder="Keep it clear and measurable"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#f8f9fa',
                              '&:hover': { backgroundColor: 'white' },
                              '&.Mui-focused': { backgroundColor: 'white' }
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outlined"
                onClick={addOffer}
                startIcon={<Add />}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 2,
                  borderStyle: 'dashed',
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  textTransform: 'none',
                  // '&:hover': {
                  //   borderColor: '#7c3aed',
                  //   backgroundColor: '#f3f4f6'
                  // }
                }}
              >
                Add another offer
              </Button>
            </Box>

            <Box className="d-flex justify-content-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                startIcon={<ChevronLeft />}
                sx={{
                  borderRadius: '50px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderColor: '#6c757d',
                  color: '#6c757d',
                  // '&:hover': {
                  //   borderColor: '#495057',
                  //   backgroundColor: '#f8f9fa'
                  // }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ChevronRight />}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                  borderRadius: '50px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ea580c 100%)'
                  }
                }}
              >
                {formData.offers.length > 0 ? 'Done' : 'Skip for now'}
              </Button>
            </Box>
          </Box>
        );

      case 5:
        return (
          <Box>
            <Box className="text-center mb-4">
              <Box className="d-flex justify-content-center mb-3">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Message sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h3" className="fw-bold text-dark mb-3">Pick your voice</Typography>
              <Typography variant="body1" className="text-muted">
                Let's make sure your content sounds like you instead of like a robot with an MBA that uses too many m dashes and "the best part?" (hehehe).
              </Typography>
            </Box>

            <Box className="mb-4">
              <Box className="d-flex align-items-center mb-3">
                <Edit sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                <Typography variant="h6" className="fw-medium">
                  Choose up to three words that describe how you want to sound.
                </Typography>
              </Box>
              <Box className="d-flex align-items-center mb-3">
                <FlashOn sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                <Typography variant="body2" className="text-muted">
                  We'll keep that energy in everything we create.
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {voiceOptions.map(voice => (
                  <Grid item xs={6} md={4} key={voice.text}>
                    <Button
                      variant={formData.voiceTone.includes(voice.text) ? "contained" : "outlined"}
                      onClick={() => handleMultiSelect('voiceTone', voice.text, 3)}
                      startIcon={voice.icon}
                      endIcon={formData.voiceTone.includes(voice.text) ? <Check /> : null}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        ...(formData.voiceTone.includes(voice.text) 
                          ? {
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)'
                              }
                            }
                          : {
                              borderColor: '#8b5cf6',
                              color: '#8b5cf6',
                              // '&:hover': {
                              //   borderColor: '#7c3aed',
                              //   backgroundColor: '#f3f4f6'
                              // }
                            })
                      }}
                    >
                      {voice.text}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Box className="d-flex align-items-center mt-2">
                <Star sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                <Typography variant="body2" className="text-muted">
                  {formData.voiceTone.length} of 3 selected
                </Typography>
              </Box>
            </Box>

            <Box className="mb-4">
              <Box className="d-flex align-items-center mb-3">
                <MenuBook sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                <Typography variant="h6" className="fw-medium">
                  Your default post length?
                </Typography>
              </Box>
              <Box className="d-flex align-items-center mb-3">
                <Edit sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                <Typography variant="body2" className="text-muted">
                  It'll be medium to long unless you tell me otherwise later. You can always edit it.
                </Typography>
              </Box>
              <Box className="d-flex gap-2">
                {['short', 'medium', 'long'].map(length => (
                  <Button
                    key={length}
                    variant={formData.postLength === length ? "contained" : "outlined"}
                    onClick={() => setFormData({ ...formData, postLength: length })}
                    sx={{
                      borderRadius: '50px',
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      ...(formData.postLength === length 
                        ? {
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                            color: 'white'
                          }
                        : {
                            borderColor: '#8b5cf6',
                            color: '#8b5cf6'
                          })
                    }}
                  >
                    {length.charAt(0).toUpperCase() + length.slice(1)}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box className="d-flex justify-content-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                startIcon={<ChevronLeft />}
                sx={{
                  borderRadius: '50px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderColor: '#6c757d',
                  color: '#6c757d',
                  // '&:hover': {
                  //   borderColor: '#495057',
                  //   backgroundColor: '#f8f9fa'
                  // }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ChevronRight />}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                  borderRadius: '50px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ea580c 100%)'
                  }
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );

      case 6:
        return (
          <Box>
            <Box className="text-center mb-4">
              <Box className="d-flex justify-content-center mb-3">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h3" className="fw-bold text-dark mb-3">Key Stories and Humble Brags</Typography>
              <Typography variant="body1" className="text-muted mb-3">
                Now let's get to the good stuff. I want all the stories, the magic, the receipts.
              </Typography>
              <Box className="d-flex align-items-center justify-content-center">
                <Favorite sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                <Typography variant="body2" className="text-muted">
                  Please drop anything that helps me understand the heart of your brand:
                </Typography>
              </Box>
            </Box>

            <Box className="row g-4 mb-4">
              <Box className="col-12">
                <Box className="d-flex align-items-center mb-2">
                  <MenuBook sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" className="fw-medium">
                    How did this all start? What pushed you to build your business?
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={formData.originStory}
                  onChange={e => setFormData({ ...formData, originStory: e.target.value })}
                  placeholder="Tell your origin story..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      '&:hover': { backgroundColor: 'white' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }
                  }}
                />
              </Box>

              <Box className="col-12">
                <Box className="d-flex align-items-center mb-2">
                  <GpsFixed sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" className="fw-medium">
                    What challenges have you overcome along the way?
                  </Typography>
                </Box>
                <Box className="d-flex align-items-center mb-2">
                  <People sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                  <Typography variant="body2" className="text-muted">
                    Before or after you started your business that your audience could relate to or cheer for you about?
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={formData.challenges}
                  onChange={e => setFormData({ ...formData, challenges: e.target.value })}
                  placeholder="Share your challenges and how you overcame them..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      '&:hover': { backgroundColor: 'white' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }
                  }}
                />
              </Box>

              <Box className="col-12">
                <Box className="d-flex align-items-center mb-2">
                  <Star sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" className="fw-medium">
                    What's gone right? This is your moment!
                  </Typography>
                </Box>
                <Box className="mb-2">
                  <Typography variant="body2" className="text-muted d-flex align-items-center mb-1">
                    <EmojiEvents sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                    Think: Awards, Wild sales numbers, Podcasts, press, TEDx talks
                  </Typography>
                  <Typography variant="body2" className="text-muted d-flex align-items-center mb-1">
                    <People sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                    Big partnerships or dream clients, "holy sh*t" moments, Press
                  </Typography>
                  <Typography variant="body2" className="text-muted d-flex align-items-center">
                    <ThumbUp sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                    Don't hold back. This is how we build trust, and create content that actually lands.
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={formData.wins}
                  onChange={e => setFormData({ ...formData, wins: e.target.value })}
                  placeholder="Share your wins, achievements, and proud moments..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      '&:hover': { backgroundColor: 'white' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }
                  }}
                />
              </Box>

              <Box className="col-12">
                <Box className="d-flex align-items-center mb-2">
                  <Message sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" className="fw-medium">
                    Your testimonials
                  </Typography>
                </Box>
                <Box className="d-flex align-items-center mb-2">
                  <Star sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                  <Typography variant="body2" className="text-muted">
                    Minimum 5, max 20. Tag each with the offer it goes with if you can.
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  variant="outlined"
                  value={formData.testimonials}
                  onChange={e => setFormData({ ...formData, testimonials: e.target.value })}
                  placeholder="Paste your testimonials here, one per line or separated by paragraphs..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      '&:hover': { backgroundColor: 'white' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }
                  }}
                />
              </Box>
            </Box>

            <Box className="d-flex justify-content-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                startIcon={<ChevronLeft />}
                sx={{
                  borderRadius: '50px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderColor: '#6c757d',
                  color: '#6c757d',
                  // '&:hover': {
                  //   borderColor: '#495057',
                  //   backgroundColor: '#f8f9fa'
                  // }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ChevronRight />}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                  borderRadius: '50px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ea580c 100%)'
                  }
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );

      case 7:
        return (
          <Box>
            <Box className="text-center mb-4">
              <Box className="d-flex justify-content-center mb-3">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Link sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
              <Typography variant="h3" className="fw-bold text-dark mb-3">Media and Connections</Typography>
              <Typography variant="body1" className="text-muted">
                You'll be able to link up the tools you already use so content creation feels even more seamless.
              </Typography>
            </Box>

            <Box className="mb-4">
              <Box className="d-flex align-items-center mb-3">
                <Settings sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                <Typography variant="h6" className="fw-medium">
                  What would you like to connect?
                </Typography>
              </Box>
              <Box className="d-grid gap-3">
                {connectionOptions.map(option => (
                  <FormControlLabel
                    key={option.text}
                    control={
                      <Checkbox
                        checked={formData.connections.includes(option.text)}
                        onChange={() => handleMultiSelect('connections', option.text)}
                        sx={{
                          color: '#8b5cf6',
                          '&.Mui-checked': {
                            color: '#8b5cf6'
                          }
                        }}
                      />
                    }
                    label={
                      <Box className="d-flex align-items-center">
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: '#f8f9fa',
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {option.icon}
                        </Box>
                        <Typography variant="body2">{option.text}</Typography>
                      </Box>
                    }
                    sx={{
                      margin: 0,
                      padding: 2,
                      border: '2px solid #e9ecef',
                      borderRadius: 2,
                      // '&:hover': {
                      //   borderColor: '#8b5cf6',
                      //   backgroundColor: '#f8f9fa'
                      // }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box className="mb-4">
              <Box className="d-flex align-items-center mb-3">
                <Check sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                <Typography variant="h6" className="fw-medium">
                  Do you consent to connect these?
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.consent}
                    onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                    sx={{
                      color: '#8b5cf6',
                      '&.Mui-checked': {
                        color: '#8b5cf6'
                      }
                    }}
                  />
                }
                label="Yes, I'd like to connect tools when this feature launches"
                sx={{
                  margin: 0,
                  padding: 2,
                  border: '2px solid #e9ecef',
                  borderRadius: 2,
                  width: '100%'
                }}
              />
            </Box>

            <Box className="mb-4">
              <Box className="d-flex align-items-center mb-2">
                <FlashOn sx={{ fontSize: 20, color: '#8b5cf6', mr: 1 }} />
                <Typography variant="h6" className="fw-medium">
                  Are there any other features you WISH we would add?
                </Typography>
              </Box>
              <Box className="d-flex align-items-center mb-2">
                <Settings sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
                <Typography variant="body2" className="text-muted">
                  We're always building so just pop it in here:
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.additionalFeatures}
                onChange={e => setFormData({ ...formData, additionalFeatures: e.target.value })}
                placeholder="What features would you love to see?"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover': { backgroundColor: 'white' },
                    '&.Mui-focused': { backgroundColor: 'white' }
                  }
                }}
              />
            </Box>

            <Box className="d-flex justify-content-between">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                startIcon={<ChevronLeft />}
                sx={{
                  borderRadius: '50px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderColor: '#6c757d',
                  color: '#6c757d',
                  // '&:hover': {
                  //   borderColor: '#495057',
                  //   backgroundColor: '#f8f9fa'
                  // }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  const output = generateOutput();
                  submitQuestion(output).unwrap();
                  dispatch(updateUserDetail({ has_answered: true }));
                  navigate("/");
                }}
                startIcon={<Favorite />}
                endIcon={<Check />}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                  borderRadius: '50px',
                  py: 2,
                  px: 4,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ea580c 100%)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Finish Setup
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)'
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box className="mb-4">
          <Box className="d-flex justify-content-between align-items-center mb-3">
            <Box className="d-flex align-items-center">
              <Schedule sx={{ fontSize: 16, color: '#6c757d', mr: 1 }} />
              <Typography variant="body2" className="fw-medium text-muted">
                Step {currentStep} of 7
              </Typography>
            </Box>
            <Typography variant="body2" className="fw-medium text-muted">
              {Math.round((currentStep / 7) * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(currentStep / 7) * 100}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: '#e9ecef',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                borderRadius: 6
              }
            }}
          />
        </Box>

        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              borderRadius: 6,
              p: { xs: 4, md: 6 },
              backgroundColor: 'white',
              border: '1px solid #e9ecef'
            }}
          >
            {renderStep()}
          </Paper>
        </Container>
      </Container>
    </Box>
  );
}

export default Questions;