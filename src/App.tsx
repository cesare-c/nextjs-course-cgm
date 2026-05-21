import { useState } from 'react'
import ProfileCard from './components/ProfileCard'
import TaskList from './components/TaskList'
import TaskListAsync from './components/TaskListAsync'
import RegistrationForm from './components/RegistrationForm'
import UserList from './components/UserList'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        {/* ----------------------------------ESERCIZIO GIORNO 25 */}
        <div className="exercise-container" style={{ backgroundColor: '#eefcf5', paddingBottom: '40px', paddingTop: '10px' }}>
          <h2 className="exercise-title" style={{ marginTop: 0 }}>Esercizio 25 ---------- 21.Maggio.2026</h2>
          <hr />
          <UserList />
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 24 */}
        <div className="exercise-container" style={{ backgroundColor: '#fdf5e6', paddingBottom: '40px', paddingTop: '10px' }}>
          <h2 className="exercise-title" style={{ marginTop: 0 }}>Esercizio 24 ---------- 20.Marzo.2026</h2>
          <hr />
          <RegistrationForm />
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 23 */}
        <div className="exercise-container" style={{ backgroundColor: '#e6e6fa', paddingBottom: '40px', paddingTop: '10px' }}>
          <h2 className="exercise-title" style={{ marginTop: 0 }}>Esercizio 23 ---------- 18.Marzo.2026</h2>
          <hr />
          <TaskListAsync />
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 22 */}
        <div className="exercise-container" style={{ backgroundColor: '#e0f7fa', paddingBottom: '40px', paddingTop: '10px' }}>
          <h2 className="exercise-title" style={{ marginTop: 0 }}>Esercizio 22 ---------- 15.Marzo.2026</h2>
          <hr />
          <TaskList />
        </div>

        {/* -----------------------------ESERCIZIO GIORNO 21 */}
        <div className="exercise-container" style={{ backgroundColor: '#fff0f5', borderTop: '2px solid #ccc', paddingBottom: '40px', paddingTop: '10px' }}>
          <h2 className="exercise-title" style={{ marginTop: 0 }}>Esercizio 21 ---------- 14.Marzo.2026</h2>
          {/* <hr /> */}
          <div className="profile-container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
            <ProfileCard
              // -------- props passate
              name="Mario Rossi"
              role="Senior Frontend Developer"
              isOnline={true}
              details="Esperto di React e TypeScript con oltre 10 anni di esperienza nel settore del web design."
            />
            <ProfileCard
              // -------- props passate
              name="Luigi Bianchi"
              role="UI/UX Designer"
              isOnline={false}
            />
          </div>
        </div>

        {/* ---------------------------ESERCIZIO DEFAULT */}
        <div className="exercise-container" style={{ backgroundColor: '#f0fff0', borderTop: '2px solid #ccc', paddingBottom: '40px', paddingTop: '10px' }}>
          <h2 className="exercise-title" style={{ marginTop: 0 }}>Esercizio default</h2>
          <hr />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Conteggio: {count}</p>
            <button onClick={() => setCount((c) => c - 1)} style={{ marginRight: '10px', padding: '5px 15px' }}>-</button>
            <button onClick={() => setCount((c) => c + 1)} style={{ padding: '5px 15px' }}>+</button>
          </div>
        </div>

        {/* RESTO TUTTO COMMENTATO */}
        {/* 
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        */}
      </section>

      {/* 
      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
      */}
    </>
  )
}

export default App
