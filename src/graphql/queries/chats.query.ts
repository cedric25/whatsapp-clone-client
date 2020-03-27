import gql from 'graphql-tag'
import * as fragments from '../fragments'

export default gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      ...Chat
    }
  }
  ${fragments.chat}
`
