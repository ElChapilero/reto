"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as turf from "@turf/turf";
import { supabase } from "@/lib/supabaseClient";

// Importar los componentes de react-leaflet de forma dinámica (solo cliente)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

export default function Rutas() {
  const [destinos, setDestinos] = useState([]);
  const [ruta, setRuta] = useState([]);
  const [LClient, setLClient] = useState(null); // ✅ Leaflet cargado dinámicamente

  // ✅ Cargar Leaflet solo en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => setLClient(leaflet));
    }
  }, []);

  // ✅ Cargar destinos desde Supabase
  useEffect(() => {
    const fetchDestinos = async () => {
      const { data, error } = await supabase
        .from("destinos_seleccionados")
        .select("*");
      if (error) console.error("Error cargando destinos:", error);
      else setDestinos(data || []);
    };
    fetchDestinos();
  }, []);

  // ✅ Calcular ruta más corta con Turf.js
  useEffect(() => {
    if (destinos.length > 1) {
      const puntos = destinos.map((d) => [d.longitud, d.latitud]);
      const line = turf.lineString(puntos);
      const simplified = turf.simplify(line, {
        tolerance: 0.01,
        highQuality: true,
      });
      setRuta(simplified.geometry.coordinates.map((c) => [c[1], c[0]]));
    }
  }, [destinos]);

  // ✅ Crear icono circular para cada destino (solo si LClient está disponible)
  const crearIcono = (imagen, nombre) => {
    if (!LClient) return null;
    return LClient.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-circle">
          <img src="${imagen}" alt="${nombre}" />
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25],
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Panel izquierdo - Lista de destinos */}
      <div className="w-full md:w-1/3 bg-white p-6 overflow-y-auto shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-green-700">
          Rutas Turísticas
        </h1>
        <p className="text-gray-600 mb-4">
          Aquí verás los destinos seleccionados y la ruta más corta entre ellos.
        </p>

        {destinos.length === 0 ? (
          <p className="text-gray-500 italic">
            No hay destinos seleccionados aún.
          </p>
        ) : (
          destinos.map((d) => (
            <motion.div
              key={d.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 mb-3 bg-gray-100 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3"
            >
              <img
                src={d.imagen || "/placeholder.jpg"}
                alt={d.nombre}
                className="w-14 h-14 rounded-full object-cover border border-gray-300"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{d.nombre}</h3>
                <p className="text-sm text-gray-600">{d.tipo}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Panel derecho - Mapa */}
      <div className="flex-1 relative min-h-[400px] h-[70vh] md:h-auto">
        {LClient && (
          <MapContainer
            center={[1.214, -77.278]} // Coordenadas base de Nariño
            zoom={8}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />

            {/* ✅ Marcadores con imagen circular */}
            {destinos.map((d) => {
              const icono = crearIcono(
                d.imagen || "/placeholder.jpg",
                d.nombre
              );
              return (
                icono && (
                  <Marker
                    key={d.id}
                    position={[d.latitud, d.longitud]}
                    icon={icono}
                  >
                    <Popup>
                      <strong>{d.nombre}</strong>
                      <br />
                      {d.tipo}
                    </Popup>
                  </Marker>
                )
              );
            })}

            {/* ✅ Ruta dibujada */}
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
  );
}
