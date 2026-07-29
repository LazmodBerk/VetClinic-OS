import asyncio
import random

class AIService:
    @staticmethod
    async def suggest_treatment(symptoms: str, species: str) -> str:
        """
        Simulates an LLM call to suggest a treatment plan based on symptoms.
        In a real application, this would call OpenAI or Gemini API.
        """
        await asyncio.sleep(1.5) # Simulate network delay
        
        symptoms_lower = symptoms.lower()
        
        if "kusma" in symptoms_lower or "ishal" in symptoms_lower:
            return (
                "1. Dehidrasyonu önlemek için IV sıvı tedavisi (Laktatlı Ringer vb.) önerilir.\n"
                "2. Antiemetik (örn. Maropitant) uygulaması düşünülebilir.\n"
                "3. Kan sayımı (Hemogram) ve biyokimya paneli yapılarak organ fonksiyonları kontrol edilmeli.\n"
                "4. 12-24 saatlik diyet ve sonrasında gastrointestinal (GI) serisi özel mamalara geçiş."
            )
        elif "öksürük" in symptoms_lower or "ateş" in symptoms_lower:
            return (
                "1. Solunum yolu enfeksiyonu (örn. Kennel Cough) şüphesi. Akciğer radyografisi (Röntgen) çekilmelidir.\n"
                "2. Gerekirse geniş spektrumlu antibiyotik başlanabilir (Hekim kontrolünde).\n"
                "3. Bağışıklık güçlendirici takviyeler ve istirahat tavsiye edilir."
            )
        elif "kaşıntı" in symptoms_lower or "kızarıklık" in symptoms_lower:
            return (
                "1. Ektoparazit (pire/kene) kontrolü yapılmalıdır.\n"
                "2. Deri kazıntısı alınarak mikroskobik inceleme (Demodex/Sarcoptes yönünden) önerilir.\n"
                "3. Alerjik dermatit şüphesinde kortikosteroid veya oklasitinib içerikli topikal/sistemik tedavi planlanabilir."
            )
        else:
            return (
                "Belirtiler spesifik değil. \n"
                "- Detaylı genel muayene (Tansiyon, ateş, nabız, solunum) yapınız.\n"
                "- Hastanın beslenme ve su içme alışkanlıklarını sorgulayınız.\n"
                "- Gerekli görülürse tam kan sayımı (Hemogram) isteyiniz."
            )

ai_service = AIService()
