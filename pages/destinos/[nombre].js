"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ChevronLeft, MapPin, Star } from "lucide-react";
import gastronomia from "./gastronomia";
import floraFauna from "./floraFauna";
import cultura from "./cultura";
import { supabase } from "@/lib/supabaseClient";

// Carga dinámica de Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

export default function DetalleDestino() {
  const router = useRouter();
  const { nombre } = router.query;
  const [destino, setDestino] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(null);

  useEffect(() => {
    if (!router.isReady || !nombre) return;

    const nombreLimpio = decodeURIComponent(nombre).replace(/_/g, " ");
    const todos = [...gastronomia, ...floraFauna, ...cultura];
    const encontrado = todos.find((d) => d.nombre.toLowerCase() === nombreLimpio.toLowerCase());

    if (encontrado) {
      setDestino(encontrado);
      setImagenActiva(encontrado.imagen);
    } else {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from("destinos_seleccionados")
          .select("*")
          .ilike("nombre", nombreLimpio)
          .maybeSingle();

        if (!error && data) {
          setDestino(data);
          setImagenActiva(data.imagen);
        }
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

  // Galería simulada
  const imagenesGaleria = [
    destino.imagen,
    "/imagenes/naturaleza1.jpg",
    "/imagenes/naturaleza2.jpg",
    "/imagenes/pueblo1.jpg",
    "/imagenes/comida1.jpg",
  ];

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

        {/* Contenedor principal */}
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
          {/* Miniaturas */}
          <div className="flex md:flex-col gap-2 md:w-24 md:p-4 justify-center overflow-x-auto md:overflow-y-auto md:justify-start p-2">
            {imagenesGaleria.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                  imagenActiva === img ? "border-green-600" : "border-transparent"
                }`}
                onClick={() => setImagenActiva(img)}
              >
                <img
                  src={img}
                  alt={`thumbnail-${i}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Imagen principal */}
          <div className="flex-1 flex justify-center items-center bg-gray-50">
            <motion.div
              key={imagenActiva}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl aspect-[16/9] rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={imagenActiva}
                alt={destino.nombre}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Información del destino */}
        <section className="mt-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">{destino.nombre}</h1>
          <div className="flex items-center gap-2 mb-3 text-gray-600">
            <MapPin size={18} className="text-green-600" />
            <span>{destino.tipo || "Destino turístico"}</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < Math.round(destino.rating) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="ml-2 text-gray-500 text-sm">({destino.rating || "4.5"})</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{destino.descripcion}</p>
        </section>

        {/* Qué visitar */}
        <section className="mt-10 bg-gray-50 rounded-2xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">Qué visitar cerca</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Miradores naturales y senderos ecológicos.</li>
            <li>Ferias típicas y gastronomía local.</li>
            <li>Museos y artesanías culturales.</li>
            <li>Avistamiento de fauna andina.</li>
          </ul>
        </section>

        {/* Mapa */}
        {destino.latitud && destino.longitud && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">Ubicación en el mapa</h2>
            <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <MapContainer center={[destino.latitud, destino.longitud]} zoom={12} className="w-full h-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                <Marker position={[destino.latitud, destino.longitud]}>
                  <Popup>
                    <strong>{destino.nombre}</strong>
                    <br />
                    {destino.tipo}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </section>
        )}

        {/* Realidad Aumentada */}
        <section className="text-center mt-10 bg-gradient-to-r from-green-100 to-cyan-50 rounded-2xl shadow-md py-10 border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-800 mb-3">
            Experiencia en Realidad Aumentada
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Descubre este destino de una forma diferente: explora modelos 3D, flora, fauna y arquitectura en RA.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 hover:shadow-lg transition-all"
            onClick={() => alert("Aquí se abriría la experiencia de Realidad Aumentada")}
          >
            Explorar en RA
          </motion.button>
        </section>
      </div>
    </div>
  );
}
