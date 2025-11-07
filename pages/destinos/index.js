"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

import gastronomia from "./gastronomia";
import floraFauna from "./floraFauna";
import cultura from "./cultura";

export default function Destinos() {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [user, setUser] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);

  // Traer sesión activa
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    fetchUser();
  }, []);

  // Unir todas las categorías
  const todas = [
    ...gastronomia.map((d) => ({ ...d, tipo: "gastronomia" })),
    ...floraFauna.map((d) => ({ ...d, tipo: "flora" })),
    ...cultura.map((d) => ({ ...d, tipo: "cultura" })),
  ];

  // Buscar los destinos guardados por el usuario
  useEffect(() => {
    if (!user) return;
    const fetchSeleccionados = async () => {
      const { data, error } = await supabase
        .from("destinos_seleccionados")
        .select("nombre")
        .eq("user_id", user.id);

      if (!error && data) {
        setSeleccionados(data.map((d) => d.nombre));
      }
    };
    fetchSeleccionados();
  }, [user]);

  // Manejar selección / deselección
  const toggleSeleccion = async (dest) => {
    if (!user) {
      alert("Por favor inicia sesión para seleccionar destinos.");
      return;
    }

    const yaSeleccionado = seleccionados.includes(dest.nombre);

    if (yaSeleccionado) {
      // Eliminar
      const { error } = await supabase
        .from("destinos_seleccionados")
        .delete()
        .eq("user_id", user.id)
        .eq("nombre", dest.nombre);

      if (!error)
        setSeleccionados(seleccionados.filter((n) => n !== dest.nombre));
    } else {
      // Agregar
      const { error } = await supabase.from("destinos_seleccionados").insert([
        {
          user_id: user.id,
          nombre: dest.nombre,
          tipo: dest.tipo,
          descripcion: dest.descripcion,
          imagen: dest.imagen,
          rating: dest.rating,
          latitud: dest.latitud,
          longitud: dest.longitud,
        },
      ]);

      if (!error) setSeleccionados([...seleccionados, dest.nombre]);
    }
  };

  // Filtrar resultados
  const filtradas = todas.filter((dest) => {
    const coincideTexto =
      dest.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      dest.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtro === "todas" || dest.tipo === filtro;
    return coincideTexto && coincideCategoria;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-3 text-center">
          Destinos de Nariño
        </h1>
        <p className="text-gray-600 text-center text-lg mb-10">
          Explora lugares y marca tus favoritos para crear tu ruta
          personalizada.
        </p>

        {/* Barra de búsqueda y filtro */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="relative w-full sm:w-2/3">
            <input
              type="text"
              placeholder="Buscar destino..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>

          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
          >
            <option value="todas">Todas las categorías</option>
            <option value="gastronomia">Gastronomía</option>
            <option value="flora">Flora y Fauna</option>
            <option value="cultura">Cultura</option>
          </select>
        </div>

        {/* Grid de destinos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtradas.map((dest, i) => {
            const activo = seleccionados.includes(dest.nombre);
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer h-[380px] flex flex-col"
              >
                {/* Botón circular */}
                <button
                  onClick={() => toggleSeleccion(dest)}
                  className={`absolute top-3 right-3 rounded-full p-1.5 shadow-md transition-all ${
                    activo
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-white text-gray-400 hover:text-green-600"
                  }`}
                >
                  {activo ? <CheckCircle size={22} /> : <Circle size={22} />}
                </button>

                <Link
                  href={`/destinos/${encodeURIComponent(
                    dest.nombre.replace(/\s+/g, "_")
                  )}`}
                >
                  <img
                    src={dest.imagen}
                    alt={dest.nombre}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold text-green-700 mb-2 group-hover:underline">
                      {dest.nombre}
                    </h2>
                    <p className="text-gray-600 text-sm flex-grow">
                      {dest.descripcion}
                    </p>
                    <div className="text-right text-yellow-600 font-semibold mt-2">
                      ⭐ {dest.rating}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtradas.length === 0 && (
          <div className="text-center mt-10 text-gray-500">
            No se encontraron resultados para “{busqueda}”.
          </div>
        )}
      </div>
    </div>
  );
}
