'use client';

import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = '+8801709414230';

export default function WhatsAppButton() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 3, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 left-6 z-50 group"
    >
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#25D366' }} />

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}
      >
        <FaWhatsapp className="w-7 h-7 text-white" />
      </a>

      {/* Tooltip */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none font-bengali" style={{ background: '#1a1a1a' }}>
        WhatsApp-এ যোগাযোগ
      </div>
    </motion.div>
  );
}
