import React from 'react'
import moment from 'moment'
import { List, ListItem } from '@material-ui/core';
import { chats } from '../../db'

const ChatsList: React.FC = () => (
  <div>
    <List>
      {chats.map(chat => (
        <ListItem key={chat.id} button>
          <img src={chat.picture} alt="Profile" />
          <div>{chat.name}</div>
          <div>{chat?.lastMessage?.content}</div>
          <div>{moment(chat?.lastMessage?.createdAt).format('HH:mm')}</div>
        </ListItem>
      ))}
    </List>
  </div>
)

export default ChatsList
