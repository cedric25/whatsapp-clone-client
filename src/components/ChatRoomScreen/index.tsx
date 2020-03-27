import React, { useCallback } from 'react'
import styled from 'styled-components'
import { History } from 'history'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as queries from '../../graphql/queries'
import * as fragments from '../../graphql/fragments'

// Components
import ChatNavbar from './ChatNavbar'
import MessageInput from './MessageInput'
import MessagesList from './MessagesList'

const Container = styled.div`
  background: url(/assets/chat-background.jpg);
  display: flex;
  flex-flow: column;
  height: 100vh;
`

const getChatQuery = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      ...FullChat
    }
  }
  ${fragments.fullChat}
`

const addMessageMutation = gql`
  mutation AddMessage($chatId: ID!, $content: String!) {
    addMessage(chatId: $chatId, content: $content) {
      ...Message
    }
  }
  ${fragments.message}
`

interface ChatRoomScreenParams {
  chatId: string
  history: History
}

export interface ChatQueryMessage {
  id: string
  content: string
  createdAt: Date
}

export interface ChatQueryResult {
  id: string
  name: string
  picture: string
  messages: Array<ChatQueryMessage>
}

type OptionalChatQueryResult = ChatQueryResult | null

interface ChatsResult {
  chats: any[]
}

const ChatRoomScreen: React.FC<ChatRoomScreenParams> = ({
  history,
  chatId,
}) => {
  const { data } = useQuery<any>(getChatQuery, {
    variables: { chatId },
  })

  const [addMessage] = useMutation(addMessageMutation)

  const { chat = null } = data || {}

  const onSendMessage = useCallback(
    (content: string) => {
      if (!chat) return null

      addMessage({
        variables: { chatId, content },
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: {
            __typename: 'Message',
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            content,
          },
        },
        update: (client, { data }) => {
          if (data && data.addMessage) {
            client.writeQuery({
              query: queries.chats,
              variables: { chatId },
              data: {
                chat: {
                  ...chat,
                  messages: chat.messages.concat(data.addMessage),
                },
              },
            })
          }

          let clientChatsData
          try {
            clientChatsData = client.readQuery<ChatsResult>({
              query: queries.chats,
            })
          } catch (e) {
            return
          }

          if (!clientChatsData || !clientChatsData.chats) {
            return null
          }
          const chats = clientChatsData.chats

          const chatIndex = chats.findIndex(
            (currentChat: any) => currentChat.id === chatId
          )
          if (chatIndex === -1) return
          const chatWhereAdded = chats[chatIndex]

          chatWhereAdded.lastMessage = data.addMessage
          // The chat will appear at the top of the ChatsList component
          chats.splice(chatIndex, 1)
          chats.unshift(chatWhereAdded)

          client.writeQuery({
            query: queries.chats,
            data: { chats: chats },
          })
        },
      })
    },
    [chat, chatId, addMessage]
  )

  if (!chat) return null

  return (
    <Container>
      <ChatNavbar chat={chat} history={history} />
      {chat.messages && <MessagesList messages={chat.messages} />}
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  )
}

export default ChatRoomScreen
