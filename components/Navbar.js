'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [visible, setVisible] = useState(true)

  // Paleta base
  const colors = {
    primary: '#2E8B57', // verde
    secondary: '#3BA6E8', // azul
    accent: '#FFFFFF', // blanco para el botón
  }

  // Ocultar navbar al bajar y mostrar al subir
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      setLastScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Destinos', href: '#destinos' },
    { name: 'Experiencias', href: '#experiencias' },
    { name: 'Gastronomía', href: '#gastronomia' },
    { name: 'Contacto', href: '#contacto' },
  ]

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -90 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed w-full top-0 z-50 backdrop-blur-md transition-all duration-500 shadow-md"
      style={{
        background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* === LOGO === */}
          <a href="#inicio" className="flex items-center space-x-2">
            <img
              src="/Logo_1.svg"
              alt="Logo Vive Nariño"
              className="h-9 w-9 rounded-full shadow-md"
            />
            <span className="font-bold text-lg text-white drop-shadow-sm">
              Vive Nariño
            </span>
          </a>

          {/* === NAV DESKTOP === */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-medium text-white/90 hover:text-yellow-100 transition-all text-sm"
              >
                {link.name}
              </a>
            ))}

            {/* === SEARCH === */}
            <div className="relative ml-4">
              <input
                type="text"
                placeholder="Buscar..."
                className="border border-white/40 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-200 text-gray-900 placeholder-gray-400 bg-white/90"
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            </div>

            {/* === AUTH BUTTONS === */}
            <div className="ml-6 flex items-center space-x-3">
              <a
                href="#login"
                className="text-sm font-semibold text-white hover:text-yellow-100 transition-all"
              >
                Iniciar sesión
              </a>
              <a
                href="#registro"
                className="px-5 py-2 rounded-full text-sm font-semibold text-green-700 bg-white hover:bg-green-50 transition-all hover:scale-105 shadow-md"
              >
                Registro
              </a>
            </div>
          </div>

          {/* === MOBILE MENU BUTTON === */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-100 transition-all"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* === MOBILE MENU === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/20 bg-gradient-to-b from-green-700/95 to-blue-700/90 text-white backdrop-blur-md"
          >
            <div className="px-6 py-5 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block font-medium hover:text-yellow-200 transition-all hover:translate-x-1"
                >
                  {link.name}
                </a>
              ))}

              {/* SEARCH */}
              <div className="relative mt-4">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full border border-white/40 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-white/95 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
              </div>

              {/* BOTONES */}
              <div className="pt-4 border-t border-white/30 flex flex-col gap-3">
                <a
                  href="#login"
                  className="text-center font-semibold text-white hover:text-yellow-200 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar sesión
                </a>
                <a
                  href="#registro"
                  className="text-center px-4 py-2 rounded-full text-sm font-semibold text-green-700 bg-white hover:bg-green-50 transition-all hover:scale-105 shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Registro
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
