// ============================================
// SOUND EFFECTS USING WEB AUDIO API
// No audio files needed — generates tones dynamically
// ============================================

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.1
) {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch {
    // Silently fail if audio is blocked by browser
  }
}

// Correct answer — bright ascending chime
export function playCorrectSound() {
  playTone(523.25, 0.12, 'sine', 0.1) // C5
  setTimeout(() => playTone(659.25, 0.12, 'sine', 0.1), 80) // E5
  setTimeout(() => playTone(783.99, 0.18, 'sine', 0.1), 160) // G5
}

// Incorrect answer — low descending tone
export function playIncorrectSound() {
  playTone(311.13, 0.2, 'triangle', 0.08) // Eb4
  setTimeout(() => playTone(233.08, 0.25, 'triangle', 0.08), 120) // Bb3
}

// Lesson completion — triumphant chord
export function playCompletionSound() {
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.08), i * 100)
  })
}

// XP gain / streak — short bright pop
export function playXpSound() {
  playTone(880, 0.08, 'sine', 0.06)
  setTimeout(() => playTone(1174.66, 0.12, 'sine', 0.06), 50)
}