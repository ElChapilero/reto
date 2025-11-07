'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as turf from '@turf/turf'
import { supabase } from '@/lib/supabaseClient'

// Importar los componentes de react-leaflet de forma dinámica (solo cliente)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

// ✅ Aseguramos que L solo se use en el cliente
const L = typeof window !== 'undefined' ? require('leaflet') : null

export default function Rutas() {
  const [destinos, setDestinos] = useState([])
  const [ruta, setRuta] = useState([])

  // Carga de destinos desde Supabase
  useEffect(() => {
    const fetchDestinos = async () => {
      const { data, error } = await supabase.from('destinos_seleccionados').select('*')
      if (error) console.error('Error cargando destinos:', error)
      else setDestinos(data || [])
    }
    fetchDestinos()
  }, [])

  // Calcular la ruta más corta con Turf.js
  useEffect(() => {
    if (destinos.length > 1) {
      const puntos = destinos.map((d) => [d.longitud, d.latitud])
      const line = turf.lineString(puntos)
      const simplified = turf.simplify(line, { tolerance: 0.01, highQuality: true })
      setRuta(simplified.geometry.coordinates.map((c) => [c[1], c[0]]))
    }
  }, [destinos])

  // Ícono de los marcadores (solo cliente)
  const markerIcon =
    L &&
    new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35],
    })

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Panel izquierdo - Lista de destinos */}
      <div className="w-full md:w-1/3 bg-white p-6 overflow-y-auto shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Rutas Turísticas</h1>
        <p className="text-gray-600 mb-4">
          Aquí verás los destinos seleccionados y la ruta más corta entre ellos.
        </p>

        {destinos.length === 0 ? (
          <p className="text-gray-500 italic">No hay destinos seleccionados aún.</p>
        ) : (
          destinos.map((d) => (
            <motion.div
              key={d.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 mb-3 bg-gray-100 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="font-semibold text-gray-800">{d.nombre}</h3>
              <p className="text-sm text-gray-600">{d.tipo}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* Panel derecho - Mapa */}
      <div className="flex-1 relative min-h-[400px] h-[70vh] md:h-auto">

        {L && (
          <MapContainer
            center={[1.214, -77.278]} // Coordenadas base de Nariño
            zoom={8}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />

            {destinos.map((d) => (
              <Marker
                key={d.id}
                position={[d.latitud, d.longitud]}
                icon={markerIcon}
              >
                <Popup>
                  <strong>{d.nombre}</strong>
                  <br />
                  {d.tipo}
                </Popup>
              </Marker>
            ))}

            {ruta.length > 0 && (
              <Polyline
                positions={ruta}
                color="green"
                weight={4}
                opacity={0.8}
                smoothFactor={1}
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  )
}
