"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    pais: "",
    tipoViajero: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) router.push("/");
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { nombre, email, password, telefono, pais, tipoViajero } = formData;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, telefono, pais, tipoViajero } },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      const userId = data.user?.id;
      if (userId) {
        await supabase
          .from("usuarios")
          .insert([
            {
              id: userId,
              nombre,
              email,
              telefono,
              pais,
              tipo_viajero: tipoViajero,
            },
          ]);
      }
      setSuccess("Registro exitoso ✅ Redirigiendo...");
      setTimeout(() => router.push("/"), 1200);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado Izquierdo */}
      <div
        className="hidden md:flex md:w-1/2 flex-col items-center justify-center text-white p-10"
        style={{
          background: "linear-gradient(135deg, #2e8b57 0%, #3aa0c5 100%)",
        }}
      >
        <img
          src="/Logo_1.svg"
          alt="Logo Vive Nariño"
          className="w-24 h-24 mb-6 drop-shadow-lg"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-4"
        >
          Vive la magia de Nariño
        </motion.h1>
        <p className="text-center text-white/90 text-lg max-w-md">
          Regístrate para explorar experiencias únicas, paisajes increíbles y la
          cultura del sur de Colombia.
        </p>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Crear tu cuenta viajera
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País o ciudad
                </label>
                <input
                  name="pais"
                  type="text"
                  value={formData.pais}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de viajero
              </label>
              <select
                name="tipoViajero"
                value={formData.tipoViajero}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Selecciona...</option>
                <option value="aventurero">Aventurero</option>
                <option value="cultural">Cultural</option>
                <option value="gastronomico">Gastronómico</option>
                <option value="familiar">Familiar</option>
                <option value="ecologico">Ecológico</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-semibold text-green-700 bg-white border border-green-600 hover:bg-green-50 transition-all hover:scale-105 shadow-md"
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && (
            <p className="text-green-600 text-center mt-4">{success}</p>
          )}

          <p className="text-center text-gray-600 mt-6 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-green-600 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
