'use client';

import ProfileCard from '../exercises/Es21_Profiles/ProfileCard';
import TaskList from '../exercises/Es22_Tasks/TaskList';
import TaskListAsync from '../exercises/Es23_TasksAsync/TaskListAsync';
import RegistrationForm from '../exercises/Es24_Registration/RegistrationForm';
import UserList from '../exercises/Es25_UserList/UserList';
import UserCrudContainer from '../exercises/Es27_UserCrud/UserCrudContainer';
import UserCrudContainerDay28 from '../exercises/Es28_UserCrud/UserCrudContainer';
import TaskApiDocumentation from '../exercises/Es26_ApiDocs/TaskApiDocumentation';
import DefaultExercise from '../exercises/Es20_Default/DefaultExercise';
import Navbar from './Navbar';
import ExerciseNavbar from './ExerciseNavbar';
import Link from 'next/link';
const es31PreviewImg = '/assets/es31_preview.png';
const es34PreviewImg = '/assets/es_34.png';
const es33PreviewImg = '/assets/es_33.png';
import '../App.css';

export default function HomeContent() {
  return (
    <>
      <Navbar />
      <section id="center">
        {/* ----------------------------------ESERCIZIO GIORNO 34 */}
        <div className="exercise-container" id="es-34" style={{ backgroundColor: 'var(--es-28-bg)', paddingBottom: '40px', paddingTop: '10px', borderBottom: '2px solid var(--border)' }}>
          <ExerciseNavbar title="Esercizio Giorno 34" date="04.Giugno.2026" exerciseId="Es34_Ecommerce" />
          
          <div
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              maxWidth: '750px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '550px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                aspectRatio: '16/9',
                backgroundColor: '#1e1e2e',
              }}
            >
              <img
                src={es34PreviewImg}
                alt="Anteprima Esercizio 34"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: 'var(--text-h)', fontWeight: '700' }}>
                Next.js E-Commerce & Carrello Dinamico
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.6', maxWidth: '600px' }}>
                Un portale e-commerce collegato a JSON-Server per la gestione dei prodotti. Supporta schede di dettaglio dinamiche, navigazione isolata con Route Inspector, sincronizzazione automatica del carrello in LocalStorage e regole di spedizione calcolate in tempo reale.
              </p>
            </div>

            <Link
              href="/es34"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(170, 59, 255, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(170, 59, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(170, 59, 255, 0.25)';
              }}
            >
              Esplora esercizio 34 🚀
            </Link>
          </div>
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 33 */}
        <div className="exercise-container" id="es-33" style={{ backgroundColor: 'var(--es-28-bg)', paddingBottom: '40px', paddingTop: '10px', borderBottom: '2px solid var(--border)' }}>
          <ExerciseNavbar title="Esercizio Giorno 33" date="03.Giugno.2026" exerciseId="Es33_ResourcePortal" />
          
          <div
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              maxWidth: '750px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '550px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                aspectRatio: '16/9',
                backgroundColor: '#1e1e2e',
              }}
            >
              <img
                src={es33PreviewImg}
                alt="Anteprima Esercizio 33"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: 'var(--text-h)', fontWeight: '700' }}>
                Dashboard Risorse e Navigazione Isolata
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.6', maxWidth: '600px' }}>
                Un'applicazione gestionale autonoma di monitoraggio con sei rotte differenti. Dispone di una visualizzazione riassuntiva dei dati (utenti e attività recenti), elenchi di dettaglio filtrabili e layout annidati isolati per la gestione delle risorse.
              </p>
            </div>

            <Link
              href="/es33"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(170, 59, 255, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(170, 59, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(170, 59, 255, 0.25)';
              }}
            >
              Esplora esercizio 33 🚀
            </Link>
          </div>
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 31 */}
        <div className="exercise-container" id="es-31" style={{ backgroundColor: 'var(--es-28-bg)', paddingBottom: '40px', paddingTop: '10px', borderBottom: '2px solid var(--border)' }}>
          <ExerciseNavbar title="Esercizio Giorno 31" date="29.Maggio.2026" />
          
          <div
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              maxWidth: '750px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '550px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                aspectRatio: '16/9',
                backgroundColor: '#1e1e2e',
              }}
            >
              <img
                src={es31PreviewImg}
                alt="Anteprima Esercizio 31"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: 'var(--text-h)', fontWeight: '700' }}>
                Autenticazione Protetta con JWT & Route Guards
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.6', maxWidth: '600px' }}>
                Un'applicazione autonoma completa che implementa la registrazione e il login di utenti utilizzando token JWT gestiti tramite LocalStorage, con blocco delle aree riservate e reindirizzamenti condizionali automatizzati.
              </p>
            </div>

            <Link
              href="/es31"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(170, 59, 255, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(170, 59, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(170, 59, 255, 0.25)';
              }}
            >
              Esplora esercizio 31 🚀
            </Link>
          </div>
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 28 */}
        <div className="exercise-container" id="es-28" style={{ backgroundColor: 'var(--es-28-bg)', paddingBottom: '40px', paddingTop: '10px', borderBottom: '2px solid var(--border)' }}>
          <ExerciseNavbar title="Esercizio 28" date="26.Maggio.2026" exerciseId="Es28_UserCrud" />
          <UserCrudContainerDay28 />
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 27 */}
        <div className="exercise-container" id="es-27" style={{ backgroundColor: 'var(--es-27-bg)', paddingBottom: '40px', paddingTop: '10px', borderBottom: '2px solid var(--border)' }}>
          <ExerciseNavbar title="Esercizio 27" date="25.Maggio.2026" />
          <UserCrudContainer />
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 26 */}
        <div className="exercise-container" id="es-26" style={{ backgroundColor: 'var(--es-26-bg)', paddingBottom: '40px', paddingTop: '10px', borderBottom: '2px solid var(--border)' }}>
          <ExerciseNavbar title="Esercizio 26" date="22.Maggio.2026" />
          <TaskApiDocumentation />
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 25 */}
        <div className="exercise-container" id="es-25" style={{ backgroundColor: 'var(--es-25-bg)', paddingBottom: '40px', paddingTop: '10px' }}>
          <ExerciseNavbar title="Esercizio 25" date="21.Maggio.2026" />
          <UserList />
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 24 */}
        <div className="exercise-container" id="es-24" style={{ backgroundColor: 'var(--es-24-bg)', paddingBottom: '40px', paddingTop: '10px' }}>
          <ExerciseNavbar title="Esercizio 24" date="20.Marzo.2026" />
          <RegistrationForm />
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 23 */}
        <div className="exercise-container" id="es-23" style={{ backgroundColor: 'var(--es-23-bg)', paddingBottom: '40px', paddingTop: '10px' }}>
          <ExerciseNavbar title="Esercizio 23" date="18.Marzo.2026" />
          <TaskListAsync />
        </div>

        {/* ----------------------------------ESERCIZIO GIORNO 22 */}
        <div className="exercise-container" id="es-22" style={{ backgroundColor: 'var(--es-22-bg)', paddingBottom: '40px', paddingTop: '10px' }}>
          <ExerciseNavbar title="Esercizio 22" date="15.Marzo.2026" />
          <TaskList />
        </div>

        {/* -----------------------------ESERCIZIO GIORNO 21 */}
        <div className="exercise-container" id="es-21" style={{ backgroundColor: 'var(--es-21-bg)', borderTop: '2px solid var(--border)', paddingBottom: '40px', paddingTop: '10px' }}>
          <ExerciseNavbar title="Esercizio 21" date="14.Marzo.2026" />
          <div className="profile-container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
            <ProfileCard
              name="Mario Rossi"
              role="Senior Frontend Developer"
              isOnline={true}
              details="Esperto di React e TypeScript con oltre 10 anni di esperienza nel settore del web design."
            />
            <ProfileCard
              name="Luigi Bianchi"
              role="UI/UX Designer"
              isOnline={false}
            />
          </div>
        </div>

        {/* ---------------------------ESERCIZIO 20 */}
        <div className="exercise-container" id="es-20" style={{ backgroundColor: 'var(--es-20-bg)', borderTop: '2px solid var(--border)', paddingBottom: '40px', paddingTop: '10px' }}>
          <ExerciseNavbar title="Esercizio 20" date="13.Marzo.2026" exerciseId="Es20_Default" />
          <DefaultExercise />
        </div>
      </section>
    </>
  );
}
