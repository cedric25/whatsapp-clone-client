import React from 'react'
import { History } from 'history'
import styled from 'styled-components'
import ChatsNavbar from './ChatsNavbar'
import ChatsList from './ChatsList'

const Container = styled.div`
  height: 100vh;
`

interface ChatsListScreenProps {
  history: History
}

const ChatsListScreen: React.FC<ChatsListScreenProps> = ({ history }) => (
  <Container>
    <ChatsNavbar history={history} />
    <ChatsList history={history} />
  </Container>
)

export default ChatsListScreen
