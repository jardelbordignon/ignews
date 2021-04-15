import { NextApiRequest, NextApiResponse } from 'next'

export default (request: NextApiRequest, response: NextApiResponse) => {
  const { id } = request.query
  
  const users = [
    { id: 1, name: 'Diego'},
    { id: 2, name: 'Dani'},
    { id: 3, name: 'Rafa'},
  ]

  const user = users.find(user => user.id === Number(id))

  return response.json(user)
}
