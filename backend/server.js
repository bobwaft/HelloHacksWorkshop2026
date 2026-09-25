const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.get('/api/:id', async (req, res) => {
  const { id } = req.params

  if (id.toLowerCase() === 'me') {
    return res.send('no weaknesses')
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${encodeURIComponent(id)}/`)

    if (!response.ok) {
      return res.status(response.status).json({ error: `PokéAPI returned ${response.status}` })
    }

    const type = await response.json()
    return res.json({
      half_damage_to: type.damage_relations.half_damage_to.map(({ name }) => name),
      double_damage_from: type.damage_relations.double_damage_from.map(({ name }) => name),
    })
  } catch (error) {
    console.error('Could not fetch Pokémon type:', error)
    return res.status(502).json({ error: 'Could not reach PokéAPI' })
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
