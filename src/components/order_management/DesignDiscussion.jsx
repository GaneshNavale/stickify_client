import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  TextField,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid2';
import { useState, useRef, useEffect } from 'react';
import * as API from '../../utils/adminApi';

const StickerChangeMessenger = ({ itemId }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await API.getOrderItemMessages(itemId);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [itemId]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    try {
      await API.sendOrderItemMessage(itemId, {
        message: {
          content: input,
        },
      }).then((response) => {
        const senderName = response?.data?.sender_name || 'Admin';

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            sender_type: 'Admin',
            content: input,
            sender_name: senderName,
          },
        ]);
      });

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Grid container spacing={2} sx={{ mt: 3 }}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Card
          sx={{ mb: 3, display: 'flex', flexDirection: 'column', height: 380 }}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              maxHeight: 430,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.2,
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent:
                    msg.sender_type === 'Admin' ? 'flex-end' : 'flex-start',
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
                        ? 'primary.main'
                        : 'secondary.main',
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
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 5 }}>
        <Card
          sx={{
            mb: 3,
            maxHeight: 460,
            display: 'flex',
            flexDirection: 'column',
          }}
        ></Card>
      </Grid>
    </Grid>
  );
};

export default StickerChangeMessenger;
