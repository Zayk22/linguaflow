export function speakText(text: string, langCode?: string) {
  if (!("speechSynthesis" in window)) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  if (langCode) {
    utterance.lang = langCode
  }

  // Try to pick a voice that matches the language
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0 && langCode) {
    const voice = voices.find((v) => v.lang === langCode) || voices.find((v) => v.lang.startsWith(langCode.split("-")[0]))
    if (voice) utterance.voice = voice
  }

  window.speechSynthesis.speak(utterance)
}