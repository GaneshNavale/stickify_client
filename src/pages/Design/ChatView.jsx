import { useRef, useEffect } from 'react';

import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Stack,
  Box,
  Grid2 as Grid,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatView = ({ messages, input, setInput, handleSend, imageUrl, finalArtwork }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <Typography variant="h6" align="center" gutterBottom>
            User Uploaded Image
          </Typography>
          <img
            src={imageUrl}
            alt="User Uploaded"
            style={{
              width: '100%',
              maxWidth: '200px',
              height: 'auto',
              objectFit: 'cover',
              display: 'block',
              margin: '0 auto',
            }}
          />
          <Typography variant="h6" align="center" gutterBottom>
            Final Artwork
          </Typography>
          <img
            src={finalArtwork}
            alt="Final Artwork"
            style={{
              width: '100%',
              maxWidth: '200px',
              height: 'auto',
              objectFit: 'cover',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </Stack>
      </Grid>

      <Grid size={8}>
        <Card>
          <CardContent
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              maxHeight: '422px',
              p: 2,
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent:
                    msg.sender_type === 'Admin' ? 'flex-start' : 'flex-end',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '70%',
                    bgcolor:
                      msg.sender_type === 'Admin'
                        ? 'secondary.main'
                        : 'primary.main',
                    color: 'white',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      color: 'lightgray',
                      mb: 0.5,
                    }}
                  >
                    {msg.sender_name}
                  </Typography>
                  <Typography>{msg.content}</Typography>
                </Box>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </CardContent>
          <Divider />
          <Grid container alignItems="center" spacing={1} sx={{ mt: 1, mb: 1 }}>
            <Grid item size={{xs:10, sm:10.5, md:10.5, lg:10.5}}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item size={{xs:2, sm:1.5, md:1.5, lg:1.5}} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton color="primary" onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChatView;