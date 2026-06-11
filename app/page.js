'use client'
import { useEffect, useRef, useState } from 'react'
import { FaInstagram, FaYoutube, FaSpotify, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

const LAYERS = [
  { count: 180, size: 0.8, speed: 0.12, opacity: 0.55 }, // lejos: chicas, lentas
  { count: 90,  size: 1.4, speed: 0.28, opacity: 0.75 }, // medio
  { count: 35,  size: 2.2, speed: 0.55, opacity: 1.0  }, // cerca: grandes, rápidas
]

function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight

    // Generar estrellas una sola vez
    const stars = LAYERS.flatMap(layer =>
      Array.from({ length: layer.count }, () => ({
        x:       Math.random() * W,
        y:       Math.random() * H,
        size:    layer.size * (0.6 + Math.random() * 0.8),
        opacity: layer.opacity * (0.5 + Math.random() * 0.5),
        speed:   layer.speed,
        phase:   Math.random() * Math.PI * 2, // fase de parpadeo única por estrella
      }))
    )

    let scrollTarget = 0
    let scrollCurrent = 0

    const onScroll = () => { scrollTarget = window.scrollY }
    const onResize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    let rafId
    const draw = () => {
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.07

      // Fondo: degradado radial azul oscuro → negro (simula nebulosa lejana)
      const grad = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.85)
      grad.addColorStop(0, '#150d2e')
      grad.addColorStop(1, '#04050f')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      const t = Date.now() / 1000

      stars.forEach(star => {
        // Parallax: cada capa se desplaza a distinta velocidad
        const yOffset = (scrollCurrent * star.speed) % H
        const y = ((star.y - yOffset) % H + H) % H

        // Twinkle suave
        const twinkle = 0.65 + 0.35 * Math.sin(t * 1.8 + star.phase)

        ctx.beginPath()
        ctx.arc(star.x, y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${(star.opacity * twinkle).toFixed(3)})`
        ctx.fill()
      })

      rafId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

const SOCIALS = [
  { icon: FaInstagram, href: "https://instagram.com/uconciencia", label: "Instagram" },
  { icon: FaYoutube,   href: "https://youtube.com/@uconciencia",  label: "YouTube" },
  { icon: FaSpotify,   href: "https://open.spotify.com",          label: "Spotify" },
  { icon: FaFacebook,  href: "https://facebook.com/uconciencia",  label: "Facebook" },
  { icon: FaLinkedin,  href: "https://linkedin.com/company/uconciencia", label: "LinkedIn" },
]

const WA_NUMBER = "598091473253"

function SocialSidebar() {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {SOCIALS.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  )
}

function WhatsAppButton() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-xl p-4 w-64 text-sm leading-snug">
          <p className="font-bold text-green-600 mb-1">¡Hola! 👋</p>
          <p className="text-gray-600 mb-3">¿Tenés dudas sobre la Maestría? Escribinos y te respondemos.</p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=Hola,%20quiero%20información%20sobre%20la%20Maestría%20en%20Eneagrama%20Sistémico`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-500 hover:bg-green-600 text-white font-semibold text-center py-2 rounded-xl transition-colors"
          >
            Abrir WhatsApp
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={28} />
      </button>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <StarField />
      <SocialSidebar />
      <WhatsAppButton />
      <Navbar />
      <main>
        <Hero />
        <ParaQuien />
        <Modulos />
        <SobreLucia />
        <Testimonios />
        <Precio />
      </main>
      <Footer />
    </div>
  )
}

/* ─── NAVBAR ─────────────────────────────────────────────── */
function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-extrabold text-white tracking-tight">
          Universidad de la Conciencia
        </span>
        <a
          href="#precio"
          className="bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
        >
          Inscribirme
        </a>
      </div>
    </header>
  )
}

/* ─── HERO ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="py-40 px-6 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#F59E0B] font-semibold text-sm uppercase tracking-widest mb-4">
          Desde 1996 · Primera formación en habla hispana
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          Maestría en<br />Eneagrama Sistémico
        </h1>
        <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Si querés aprender, aplicar y transformar tu vida desde el Eneagrama,
          esta formación es para vos. Metodología propia con más de tres décadas
          de experiencia en aplicación personal, profesional y espiritual.
        </p>
        <a
          href="#precio"
          className="inline-block bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-lg px-10 py-4 rounded-full transition-colors shadow-lg"
        >
          Quiero inscribirme →
        </a>
        <p className="text-white/40 text-sm mt-4">
          Lugares limitados · [Próxima cohorte: completar fecha]
        </p>
      </div>
    </section>
  )
}

/* ─── PARA QUIÉN ES ───────────────────────────────────────── */
function ParaQuien() {
  const problemas = [
    "Buscás herramientas concretas para el autoconocimiento pero no encontrás un sistema sólido",
    "Querés integrar el desarrollo personal con tu vida profesional y espiritual",
    "Sentís que hay patrones internos que te frenan y no sabés cómo trabajarlos",
    "Necesitás una metodología probada, no solo conceptos teóricos",
  ]
  const paraQuien = [
    "Personas que quieren transformar su vida desde adentro",
    "Coaches, terapeutas y facilitadores que buscan profundizar su formación",
    "Profesionales que trabajan con el desarrollo del Capital Humano",
    "Personas en camino espiritual que buscan un marco sistémico",
  ]
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-4 drop-shadow-lg">
          ¿Esta formación es para vos?
        </h2>
        <p className="text-center text-white/60 mb-14 max-w-xl mx-auto">
          El Eneagrama Sistémico puede ser el catalizador para un cambio
          profundo y transformador en tu vida personal y profesional.
        </p>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/15">
            <h3 className="font-bold text-lg text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#D97706] rounded-full inline-block" />
              Si te reconocés en esto…
            </h3>
            <ul className="space-y-4">
              {problemas.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/70">
                  <span className="text-[#D97706] mt-0.5 text-lg leading-none shrink-0">✗</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/15">
            <h3 className="font-bold text-lg text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#9333EA] rounded-full inline-block" />
              Esta maestría es para…
            </h3>
            <ul className="space-y-4">
              {paraQuien.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/70">
                  <span className="text-[#9333EA] mt-0.5 text-lg leading-none shrink-0">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── MÓDULOS ─────────────────────────────────────────────── */
const modulos = [
  { num: "01", titulo: "[Nombre del módulo 1]", desc: "[Descripción — completar con el programa real de la Maestría]" },
  { num: "02", titulo: "[Nombre del módulo 2]", desc: "[Descripción del módulo 2]" },
  { num: "03", titulo: "[Nombre del módulo 3]", desc: "[Descripción del módulo 3]" },
  { num: "04", titulo: "[Nombre del módulo 4]", desc: "[Descripción del módulo 4]" },
  { num: "05", titulo: "[Nombre del módulo 5]", desc: "[Descripción del módulo 5]" },
  { num: "06", titulo: "[Nombre del módulo 6]", desc: "[Descripción del módulo 6]" },
]

function Modulos() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-4 drop-shadow">
          Qué vas a aprender
        </h2>
        <p className="text-center text-white/60 mb-14 max-w-xl mx-auto">
          Una formación de aplicación personal, profesional y espiritual
          con metodología propia desarrollada en más de tres décadas.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((m) => (
            <div
              key={m.num}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/15 hover:bg-black/55 transition-colors"
            >
              <span className="text-[#F59E0B] font-extrabold text-2xl">{m.num}</span>
              <h3 className="font-bold text-white mt-2 mb-2">{m.titulo}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── SOBRE LUCÍA ─────────────────────────────────────────── */
function SobreLucia() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-md rounded-3xl p-10 flex flex-col md:flex-row items-center gap-14 border border-white/10">
        <div className="shrink-0">
          <div className="w-52 h-52 rounded-full bg-gradient-to-br from-[#6B21A8] to-[#9333EA] flex items-center justify-center text-white text-5xl font-extrabold shadow-lg ring-4 ring-white/20">
            LI
          </div>
          {/* Reemplazar con:
              <Image src="/lucia.jpg" alt="Lucía Inserra" width={208} height={208}
                className="rounded-full object-cover w-52 h-52 shadow-lg ring-4 ring-white/20" />
          */}
        </div>
        <div>
          <p className="text-[#F59E0B] font-semibold text-sm uppercase tracking-widest mb-3">
            Tu formadora
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
            Lucía Inserra
          </h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Lucía Inserra es co-fundadora de la{" "}
            <strong className="text-white">Universidad de la Conciencia</strong>, institución dedicada
            al desarrollo humano desde 1996. Es creadora del modelo de{" "}
            <strong className="text-white">Eneagrama Sistémico</strong> y autora del libro{" "}
            <em>"Eneagrama Sistémico, la trama de la Conciencia"</em>, la obra
            más completa sobre Eneagrama y Niveles de Conciencia en habla hispana.
          </p>
          <p className="text-white/70 leading-relaxed mb-6">
            A lo largo de más de tres décadas acompañó a personas, profesionales
            y organizaciones a vivir despiertos e íntegros desde la{" "}
            <strong className="text-white">Conciencia del Bien-Estar</strong>: aprender a vivir el
            "aquí y ahora" con intensidad y compromiso con la realidad.
          </p>
          <ul className="flex flex-wrap gap-3">
            {[
              "Más de 30 años de experiencia",
              "Primera formación Eneagrama en habla hispana",
              "Autora: Eneagrama Sistémico",
              "uconciencia.org",
            ].map((cred) => (
              <li
                key={cred}
                className="bg-white/10 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full border border-white/20"
              >
                {cred}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─── TESTIMONIOS ─────────────────────────────────────────── */
const testimonios = [
  { nombre: "[Nombre Apellido]", rol: "[Profesión / Ciudad]", texto: "[Testimonio real — completar con experiencias auténticas de alumnos anteriores.]" },
  { nombre: "[Nombre Apellido]", rol: "[Profesión / Ciudad]", texto: "[Testimonio real — completar con experiencias auténticas de alumnos anteriores.]" },
  { nombre: "[Nombre Apellido]", rol: "[Profesión / Ciudad]", texto: "[Testimonio real — completar con experiencias auténticas de alumnos anteriores.]" },
]

function Testimonios() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-4 drop-shadow">
          Lo que dicen quienes ya cursaron
        </h2>
        <p className="text-center text-white/60 mb-14 max-w-xl mx-auto">
          Miles de personas en Argentina, Uruguay y toda habla hispana ya
          transformaron su vida con este programa.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonios.map((t, i) => (
            <div key={i} className="bg-[#6B21A8]/40 backdrop-blur-sm rounded-2xl p-7 border border-purple-400/20">
              <p className="text-[#F59E0B] text-3xl leading-none mb-4">"</p>
              <p className="text-white/80 leading-relaxed mb-6 text-sm">{t.texto}</p>
              <div>
                <p className="text-white font-bold">{t.nombre}</p>
                <p className="text-purple-300 text-sm">{t.rol}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── PRECIO + CTA ────────────────────────────────────────── */
function Precio() {
  return (
    <section id="precio" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[#F59E0B] font-semibold text-sm uppercase tracking-widest mb-4">
          Inversión
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
          Comenzá tu transformación
        </h2>
        <div className="rounded-3xl p-10 mb-8 border border-white/20 bg-black/40 backdrop-blur-md">
          <p className="text-white/50 text-sm mb-2">Pago único</p>
          <p className="text-5xl font-extrabold text-white mb-1">[$ PRECIO]</p>
          <p className="text-white/40 text-sm mb-6">
            También disponible en cuotas · PayPal · Transferencia · Efectivo
          </p>
          <ul className="text-white/70 text-sm space-y-2 mb-8 text-left max-w-xs mx-auto">
            {[
              "Formación completa de la Maestría",
              "Metodología Eneagrama Sistémico",
              "Aplicación personal, profesional y espiritual",
              "Acceso al Campus de Alumnos",
              "Acompañamiento de Lucía Inserra",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-[#F59E0B]">✓</span> {item}
              </li>
            ))}
          </ul>
          <a
            href="https://www.mercadopago.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#009EE3] hover:bg-[#0080B9] text-white font-bold text-lg px-10 py-4 rounded-full transition-colors w-full"
          >
            Pagar con Mercado Pago
          </a>
        </div>
        <p className="text-white/40 text-sm">
          ¿Tenés preguntas?{" "}
          <a href="mailto:contacto@uconciencia.org" className="text-[#F59E0B] hover:underline">
            contacto@uconciencia.org
          </a>
          {" · "}
          <a href="tel:+598091473253" className="text-[#F59E0B] hover:underline">
            (+598) 091 473 253
          </a>
        </p>
      </div>
    </section>
  )
}

/* ─── FOOTER ──────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-black/70 backdrop-blur-sm text-white/40 py-10 px-6 border-t border-white/10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div>
          <p className="font-bold text-white">Universidad de la Conciencia ®</p>
          <p className="text-xs mt-1">Desde 1996 educamos en el desarrollo humano</p>
        </div>
        <div className="flex items-center gap-4">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
              className="text-white/50 hover:text-white transition-colors">
              <Icon size={20} />
            </a>
          ))}
        </div>
        <a href="https://www.uconciencia.org" target="_blank" rel="noopener noreferrer"
          className="hover:text-white transition-colors">uconciencia.org</a>
        <p>© {new Date().getFullYear()} · Todos los derechos reservados</p>
      </div>
    </footer>
  )
}
