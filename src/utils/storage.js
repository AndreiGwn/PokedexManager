// src/utils/storage.js
const KEY = 'ptm-my-team-v1'

// Functions to save, load, and clear the Pokémon team from localStorage
export function saveTeam(team){ localStorage.setItem(KEY, JSON.stringify(team)) }
export function loadTeam(){ try{ const t = localStorage.getItem(KEY); return t? JSON.parse(t): new Array(6).fill(null) }catch(e){ return new Array(6).fill(null) } }
export function clearTeam(){ localStorage.removeItem(KEY) }