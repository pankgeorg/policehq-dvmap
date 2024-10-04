import './App.css'
import Map from './components/Map/Map'
import { DepartmentTemplate } from './components/Map/OfficePopup'
import { useLocation } from './hooks/useLocation'
import { type PoliceDepartment, usePoliceDepartmentLocationDataHook } from './hooks/usePoliceDepartmentLocationDataHook'

function App() {
  const [loading, data, error, reset, closest, setClosest] = usePoliceDepartmentLocationDataHook()
  const [requestPosition, position, locationError, resetMap] = useLocation()
  const defaultPosition = position ?? undefined
  return (
    <>
      <h3>Γραφεία αντιμετώπισης ενδοοικογενειακής βίας | Ελληνική Αστυνομία 🇬🇷</h3>
      {loading && !error ? "Loading..." : <Map closest={closest as (PoliceDepartment | null)} setClosest={setClosest as Function} defaultPosition={defaultPosition as GeolocationCoordinates} data={data as Array<PoliceDepartment>} />}
      {error && `Error happened 😓`}
      <div className="card">
        {(!position || locationError) && <button onClick={() => (requestPosition as Function)()}>
          Εύρεση κοντινότερου σημείου
        </button>}
        {(position) && <button onClick={() => (resetMap as Function)() && (reset as Function)()}>
          Επαναφορά
        </button>}<br />
        {closest && <DepartmentTemplate department={closest as any as PoliceDepartment} />}
        {false && <p>
          (οδηγίες)
        </p>}
      </div>
      <p className="read-the-docs">
        από την silentech 🐦‍⬛ για την Ελληνική Αστυνομία ©️ 2024
      </p>
    </>
  )
}

export default App
