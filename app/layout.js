import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Maestría en Eneagrama Sistémico | Universidad de la Conciencia",
  description:
    "La primera formación de Eneagrama en habla hispana. Aplicación personal, profesional y espiritual con más de tres décadas de experiencia. Lucía Inserra.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geist.variable} scroll-smooth`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
