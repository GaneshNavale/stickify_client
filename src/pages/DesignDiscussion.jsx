import { useState, useRef, useEffect } from 'react';

import { Modal, IconButton, Grid2 as Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import InitialView from './Design/InitialView';
import ChatView from './Design/ChatView';
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

  const handleApprove = async () => {
    try {
      await API.aproveArtwork(itemId, 'design_approved');
      handleClose();
    } catch (error) {
      console.error('Error approving artwork:', error);
    }
  };

  const handleSuggestChanges = () => {
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid
        container
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          maxWidth: !showChat ? '550px' : '800px',
          margin: 'auto',
          height: 'auto',
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <Grid item>
            {showChat && (
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            )}
          </Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {!showChat ? (
            <InitialView
              imageUrl={imageUrl}
              finalArtwork={finalArtwork}
              handleApprove={handleApprove}
              handleSuggestChanges={handleSuggestChanges}
            />
          ) : (
            <ChatView
              messages={messages}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              imageUrl={imageUrl}
              finalArtwork={finalArtwork}
            />
          )}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default DesignDiscussion;