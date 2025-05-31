import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app

export { default as Board } from './lib/Board.svelte';
export { default as Word } from './lib/Word.svelte';
