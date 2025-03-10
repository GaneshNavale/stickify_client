import { useState, useRef, useEffect } from 'react';

import {
  CardContent,
  IconButton,
  Typography,
  Box,
  TextField,
  Modal,
  Divider,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import * as API from '../utils/api';

const DesignDiscussion = ({
  open,
  handleClose,
  itemId,
  imageUrl,
  finalArtwork,
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await API.getAllMessages(itemId);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (open) {
      fetchMessages();
    }
  }, [open, itemId]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    try {
      const response = await API.createMessage(itemId, {
        message: {
          content: input,
        },
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: response.data.id,
          sender_type: response.data.sender_type,
          content: input,
          sender_name: response?.data?.sender_name,
        },
      ]);

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleApprove = () => {
    handleClose();
  };

  const handleSuggestChanges = () => {
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '50%',
          height: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {showChat &&
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            }
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {!showChat ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                width: '100%',
                justifyContent: 'space-around',
              }}
            >
              <Box>
                <Typography variant="h6">User Uploaded Image</Typography>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="User Uploaded"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                )}
              </Box>
              <Box>
                <Typography variant="h6">Final Artwork</Typography>
                {finalArtwork && (
                  <img
                    src={finalArtwork}
                    alt="Final Artwork"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {/* API calling on button click */}
              <Button variant="contained" color="primary" onClick={handleApprove}>
                Approve
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSuggestChanges}
              >
                Suggest Changes
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
            <Box sx={{ width: '50%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
              </Box>
              <Typography variant="h6" align="center">User Uploaded Image</Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 1,
                }}
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="User Uploaded"
                    style={{ width: '175px', height: '175px', objectFit: 'cover' }}
                  />
                )}
              </Box>
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>Final Artwork</Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 1,
                }}
              >
                {finalArtwork && (
                  <img
                    src={finalArtwork}
                    alt="Final Artwork"
                    style={{ width: '175px', height: '175px', objectFit: 'cover' }}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ width: '60%', maxHeight: '88%', display: 'flex', flexDirection: 'column' }}>
              <CardContent
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  
                  gap: 1,
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent:
                        msg.sender_type === 'Admin' ? 'flex-start' : 'flex-end',
                    }}
                  >
                    <Typography
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        maxWidth: '70%',
                        color: 'white',
                        bgcolor:
                          msg.sender_type === 'Admin'
                            ? 'secondary.main'
                            : 'primary.main',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          color: 'lightgray',
                          mb: 0.3,
                        }}
                      >
                        {msg.sender_name}
                      </Typography>
                      {msg.content}
                    </Typography>
                  </Box>
                ))}
                <div ref={chatEndRef} />
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  borderTop: '1px solid #ddd',
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <IconButton color="primary" onClick={handleSend}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default DesignDiscussion;