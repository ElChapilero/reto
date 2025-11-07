"use client";
import { motion } from "framer-motion";

export default function Home() {
  // 🎨 Paleta de colores (modifica aquí fácilmente)
  const colors = {
    primary: "#2E8B57", // verde natural
    secondary: "#3BA6E8", // azul cielo
    accent: "#FFD166", // amarillo cálido
    light: "#F9FAFB", // fondo principal
    textDark: "#1F2937", // gris oscuro
    textSoft: "#4B5563", // gris medio
  };

  return (
    <div
      className="min-h-screen text-gray-800"
      style={{
        background: colors.light,
        color: colors.textDark,
      }}
    >
      {/* === HERO SECTION === */}
      <section
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom right, ${colors.secondary}30, ${colors.primary}20)`,
        }}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>

        <div className="relative z-10 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight"
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Descubre la magia de Nariño
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl mb-8 text-gray-600"
          >
            Aventuras, cultura y paisajes únicos del sur de Colombia te esperan.
            Vive Nariño, tierra de lagos, montañas y tradición.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#destinos"
              className="w-full md:w-auto text-center px-6 py-3 rounded-md font-semibold shadow-md hover:scale-105 transition"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                color: "white",
              }}
            >
              Explorar Destinos
            </a>

            <a
              href="#contacto"
              className="w-full md:w-auto text-center px-6 py-3 rounded-md font-semibold border transition hover:shadow-lg"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: "white",
              }}
            >
              Planifica tu viaje
            </a>
          </motion.div>
        </div>
      </section>

      {/* === SOBRE NARIÑO === */}
      <section
        id="sobre"
        className="py-24 px-6 md:px-20 text-center"
        style={{
          background: `linear-gradient(to right, ${colors.light}, ${colors.secondary}10)`,
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4"
          style={{ color: colors.primary }}
        >
          Nariño: Naturaleza y Tradición
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Desde la majestuosa{" "}
          <span className="font-semibold" style={{ color: colors.primary }}>
            Laguna de la Cocha
          </span>{" "}
          hasta los paisajes del{" "}
          <span className="font-semibold" style={{ color: colors.secondary }}>
            Volcán Galeras
          </span>
          , Nariño ofrece una experiencia única para los amantes de la
          naturaleza, el arte y la cultura andina. Disfruta de su gastronomía,
          festivales y la calidez de su gente.
        </motion.p>
      </section>

      {/* === DESTINOS DESTACADOS === */}
      <section
        id="destinos"
        className="py-24 px-6 md:px-20 text-center"
        style={{
          background: `linear-gradient(to top right, ${colors.accent}20, ${colors.light})`,
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12"
          style={{ color: colors.secondary }}
        >
          Destinos Imperdibles
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: "Laguna de la Cocha",
              desc: "Un espejo natural rodeado de montañas y neblina. Ideal para paseos en lancha y ecoturismo.",
              img: "/cocha.jpg",
            },
            {
              title: "Santuario de Las Lajas",
              desc: "Maravilla arquitectónica incrustada entre cañones, una joya del turismo religioso.",
              img: "/lajas.jpg",
            },
            {
              title: "Volcán Galeras",
              desc: "Ofrece vistas espectaculares de Pasto y sus alrededores. Perfecto para fotografía y senderismo.",
              img: "/galeras.jpg",
            },
            {
              title: "Carnaval de Negros y Blancos",
              desc: "Patrimonio de la humanidad lleno de color, música y cultura.",
              img: "/carnaval.jpg",
            },
            {
              title: "Ipiales y frontera",
              desc: "Ciudad vibrante, con comercio y paisajes únicos del sur del país.",
              img: "/ipiales.jpg",
            },
            {
              title: "Tuquerres y el Altiplano",
              desc: "Paisajes rurales, tradición agrícola y miradores espectaculares.",
              img: "/tuquerres.jpg",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-200"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.img})`,
                }}
              ></div>
              <div className="p-6 text-left">
                <h3
                  className="font-semibold mb-2 text-lg"
                  style={{ color: colors.primary }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === CTA FINAL === */}
      <section
        className="py-24 px-6 text-center flex flex-col items-center"
        style={{
          background: `linear-gradient(to right, ${colors.secondary}10, ${colors.accent}20)`,
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-6 leading-tight"
          style={{ color: colors.primary }}
        >
          ¡Ven a vivir Nariño!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-gray-600 max-w-lg mx-auto mb-10 text-lg leading-relaxed px-2"
        >
          Conecta con la naturaleza, la historia y la calidez de su gente.
          Nariño te espera con los brazos abiertos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center w-full max-w-md"
        >
          <a
            href="#contacto"
            className="w-full md:w-auto text-center px-6 py-3 rounded-md font-semibold text-white hover:scale-105 transition"
            style={{
              background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            Planifica tu viaje
          </a>

          <a
            href="#destinos"
            className="w-full md:w-auto text-center border px-6 py-3 rounded-md font-semibold transition hover:shadow-md"
            style={{
              borderColor: colors.secondary,
              color: colors.secondary,
              backgroundColor: "white",
            }}
          >
            Ver destinos
          </a>
        </motion.div>
      </section>
    </div>
  );
}
