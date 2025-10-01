import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "¿Cómo puedo inscribirme en la UASD?",
    answer: "Para inscribirte en la UASD, debes seguir estos pasos: 1) Realizar la prueba POMA, 2) Presentar documentos originales (acta de nacimiento, certificado de bachiller, fotos), 3) Completar el formulario de inscripción en línea, 4) Realizar el pago correspondiente."
  },
  {
    question: "¿Cuánto cuesta estudiar en la UASD?",
    answer: "La UASD es una universidad pública con costos muy accesibles. El costo por asignatura varía según el programa, pero generalmente ronda los RD$ 100-200 por crédito. También hay cuotas adicionales por servicios estudiantiles y laboratorios."
  },
  {
    question: "¿Cuáles son los períodos de inscripción?",
    answer: "La UASD tiene dos semestres principales: Enero-Mayo y Agosto-Diciembre. También hay un período intensivo en verano (Junio-Julio). Las fechas exactas de inscripción se publican en el calendario académico oficial."
  },
  {
    question: "¿Qué documentos necesito para inscribirme?",
    answer: "Necesitas: Acta de nacimiento original y copia, Certificado oficial de bachiller, 2 fotos 2x2, Copia de la cédula o pasaporte, Certificado médico, Resultados de la prueba POMA."
  },
  {
    question: "¿Cómo funciona el sistema de calificaciones?",
    answer: "El sistema de calificaciones va de 0 a 100 puntos. La nota mínima de aprobación es 70. La escala es: 90-100 (A), 80-89 (B), 70-79 (C), 60-69 (D), 0-59 (F)."
  },
  {
    question: "¿Qué es la prueba POMA?",
    answer: "La Prueba de Orientación y Medición Académica (POMA) es un examen de admisión obligatorio que evalúa las competencias básicas en áreas como matemáticas, lenguaje y razonamiento."
  },
  {
    question: "¿Puedo transferirme desde otra universidad?",
    answer: "Sí, la UASD acepta transferencias. Debes presentar el récord de notas oficial de tu universidad anterior, los programas de las asignaturas cursadas y cumplir con los requisitos de admisión regulares."
  },
  {
    question: "¿Hay modalidad virtual disponible?",
    answer: "Sí, la UASD ofrece algunas asignaturas y programas en modalidad virtual o semipresencial. La disponibilidad varía según la carrera y el semestre."
  },
  {
    question: "¿Cuánto tiempo duran las carreras?",
    answer: "La duración típica es de 4-5 años para licenciaturas e ingenierías, cursando la carga académica completa. El tiempo puede variar según la carrera y la cantidad de asignaturas que tomes por semestre."
  },
  {
    question: "¿Qué servicios ofrece la universidad a los estudiantes?",
    answer: "La UASD ofrece biblioteca, laboratorios, servicios médicos, orientación académica, actividades deportivas y culturales, wifi en el campus, y programas de becas para estudiantes destacados."
  }
];

const FAQ: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h2 className={`text-3xl font-bold mb-8 text-center ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Preguntas Frecuentes
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`rounded-lg ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-50'
            } shadow-sm transition-all duration-200`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between"
            >
              <h3 className={`text-left font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {faq.question}
              </h3>
              {openIndex === index ? (
                <ChevronUp className={`flex-shrink-0 ml-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              ) : (
                <ChevronDown className={`flex-shrink-0 ml-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              )}
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className={`px-6 pb-4 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;