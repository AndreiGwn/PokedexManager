// src/services/PokeApi.js
const BASE = 'https://pokeapi.co/api/v2'

// Fetch a Pokémon by its name or ID
export async function fetchPokemonByNameOrId(q){
const r = await fetch(`${BASE}/pokemon/${q.toString().toLowerCase()}`)
if(!r.ok) throw new Error('Not found')
return r.json()
}

// Fetch a list of Pokémon with details, using limit and offset for pagination
export async function fetchPokemonList(limit=20, offset=0){
const r = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`)
if(!r.ok) throw new Error('Failed')
const data = await r.json()

// fetch details in parallel (small list)
const detailed = await Promise.all(data.results.map(async item=>{
const rr = await fetch(item.url)
return rr.json()
}))
return detailed
}