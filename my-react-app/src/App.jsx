import { useState } from 'react'

const types = [
  { name: 'Fire', color: 'bg-red-500 hover:bg-red-600' },
  { name: 'Water', color: 'bg-sky-500 hover:bg-sky-600' },
  { name: 'Grass', color: 'bg-emerald-500 hover:bg-emerald-600' },
]

function App() {
  const [selectedType, setSelectedType] = useState('')
  const [result, setResult] = useState(null)

  async function getMatchup(type) {
    try {
      const response = await fetch(`http://localhost:3000/api/${encodeURIComponent(type.toLowerCase())}`)
      const body = await response.text()

      if (!response.ok) {
        throw new Error(body || `Request failed with status ${response.status}`)
      }

      try {
        return JSON.parse(body)
      } catch {
        return body
      }
    } catch (error) {
      console.error('Could not get matchup:', error)
      return { error: 'Could not load the matchup. Make sure the backend is running.' }
    }
  }

  async function handleTypeClick(type) {
    setSelectedType(type)
    setResult(await getMatchup(type))
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-4 py-10 text-slate-800">
      <section className="w-full max-w-md rounded-2xl border-4 border-slate-800 bg-white p-7 shadow-[6px_6px_0_#1e293b] sm:p-9">
        <div className="mb-6 flex items-center gap-3">
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full border-4 border-slate-800 bg-red-500 text-2xl">
            ⚪
          </span>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Trainer challenge</p>
        </div>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Pokémon Showdown!</h1>
        <p className="mt-3 text-slate-600">What type of Pokémon are you fighting?</p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          {types.map(({ name, color }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleTypeClick(name)}
              className={`${color} rounded-xl px-4 py-3 font-bold text-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800`}
            >
              {name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleTypeClick('Me')}
            className="rounded-xl border-2 border-slate-300 bg-slate-100 px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
          >
            Me
          </button>
        </div>

        {selectedType && (
          <p aria-live="polite" className="mt-5 text-center font-semibold text-slate-700">
            {typeof result === 'string' ? result : result?.error ? result.error : (
              <>
                You clicked: {selectedType}
                {result && (
                  <span className="mt-2 block text-sm font-normal">
                    Half damage to: {result.half_damage_to?.join(', ') || 'none'}
                    <br />
                    Double damage from: {result.double_damage_from?.join(', ') || 'none'}
                  </span>
                )}
              </>
            )}
          </p>
        )}
      </section>
    </main>
  )
}

export default App
