import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '6287876974117';
const WHATSAPP_MESSAGE = 'Halo Admin SIPERKAT DPMPTSP Banyumas, saya ingin bertanya tentang sistem peminjaman.';

export const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 bg-success text-success-foreground p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-2 group"
      title="Hubungi Admin via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-sm font-medium">
        Hubungi Kami
      </span>
    </a>
  );
};
