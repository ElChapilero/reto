import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import 'leaflet/dist/leaflet.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Navbar global */}
      <Navbar />

      {/* Contenido de cada página */}
      <main className="pt-16">
        <Component {...pageProps} />
      </main>
    </>
  )
}
