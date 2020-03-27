import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import App from './App'
import { mockApolloClient } from './test-helpers'

it('renders without crashing', () => {
  const client = mockApolloClient([])
  const div = document.createElement('div')

  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
