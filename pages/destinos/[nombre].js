"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import gastronomia from "./gastronomia";
import floraFauna from "./floraFauna";
import cultura from "./cultura";
import { supabase } from "@/lib/supabaseClient";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

export default function DetalleDestino() {
  const router = useRouter();
  const { nombre } = router.query;
  const [destino, setDestino] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [LClient, setLClient] = useState(null); // ✅ Leaflet dinámico

  // ✅ Importar Leaflet solo en cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => setLClient(leaflet));
    }
  }, []);

  useEffect(() => {
    if (!router.isReady || !nombre) return;

    const nombreLimpio = decodeURIComponent(nombre).replace(/_/g, " ");
    const todos = [...gastronomia, ...floraFauna, ...cultura];
    const encontrado = todos.find(
      (d) => d.nombre.toLowerCase() === nombreLimpio.toLowerCase()
    );

    if (encontrado) {
      setDestino(encontrado);
    } else {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from("destinos_seleccionados")
          .select("*")
          .ilike("nombre", nombreLimpio)
          .maybeSingle();

        if (!error && data) setDestino(data);
      };
      fetchData();
    }
  }, [nombre, router.isReady]);

  if (!destino) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-600">
        Cargando información del destino...
      </div>
    );
  }

  // Galería: repetir la misma imagen del destino varias veces
  const imagenesGaleria = Array(5).fill(destino.imagen);

  const siguiente = () => {
    setImagenActiva((prev) => (prev + 1) % imagenesGaleria.length);
  };

  const anterior = () => {
    setImagenActiva(
      (prev) => (prev - 1 + imagenesGaleria.length) % imagenesGaleria.length
    );
  };

  const colors = {
    primary: "#2E8B57",
    secondary: "#3BA6E8",
  };

  // ✅ Crear icono circular con imagen solo si Leaflet está disponible
  const iconoPersonalizado =
    LClient &&
    LClient.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-circle">
          <img src="${destino.imagen}" alt="${destino.nombre}" />
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25],
    });

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Botón volver */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-green-700 hover:text-green-900 mb-6 transition-all hover:scale-105"
        >
          <ChevronLeft className="mr-2" /> Volver a destinos
        </button>

        {/* Galería */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-10">
          {/* Imagen principal */}
          <div className="relative w-full aspect-[16/9]">
            <motion.img
              key={imagenActiva}
              src={imagenesGaleria[imagenActiva]}
              alt={`imagen-${imagenActiva}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
            />

            {/* Flechas */}
            <button
              onClick={anterior}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
            >
              <ChevronLeft className="text-green-700" />
            </button>
            <button
              onClick={siguiente}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
            >
              <ChevronRight className="text-green-700" />
            </button>
          </div>

          {/* Miniaturas */}
          <div className="flex gap-3 overflow-x-auto p-3 bg-gray-50 border-t border-gray-200 justify-center">
            {imagenesGaleria.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                onClick={() => setImagenActiva(i)}
                className={`w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 cursor-pointer transition-all ${
                  imagenActiva === i ? "border-green-600" : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`miniatura-${i}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Información del destino */}
        <section className="mt-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            {destino.nombre}
          </h1>
          <div className="flex items-center gap-2 mb-3 text-gray-600">
            <MapPin size={18} className="text-green-600" />
            <span>{destino.tipo || "Destino turístico"}</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.round(destino.rating || 4)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-gray-500 text-sm">
              ({destino.rating || "4.5"})
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{destino.descripcion}</p>
        </section>

        {/* Mapa */}
        {destino.latitud && destino.longitud && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              Ubicación en el mapa
            </h2>
            <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <MapContainer
                center={[destino.latitud, destino.longitud]}
                zoom={12}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {/* ✅ Marcador circular solo si Leaflet está listo */}
                {iconoPersonalizado && (
                  <Marker
                    position={[destino.latitud, destino.longitud]}
                    icon={iconoPersonalizado}
                  >
                    <Popup>
                      <strong>{destino.nombre}</strong>
                      <br />
                      {destino.tipo}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </section>
        )}

        {/* Realidad Aumentada */}
        <section
          className="text-center mt-10 rounded-2xl shadow-md py-10 border border-gray-200"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
          }}
        >
          <h2 className="text-2xl font-semibold text-white mb-3">
            Experiencia en Realidad Aumentada
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Explora este destino de manera inmersiva mediante modelos 3D
            interactivos.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 bg-white text-green-700 font-semibold rounded-full hover:bg-gray-100 transition-all shadow-md"
            onClick={() =>
              alert("Aquí se abriría la experiencia de Realidad Aumentada")
            }
          >
            Explorar en RA
          </motion.button>
        </section>
      </div>
    </div>
  );
}
