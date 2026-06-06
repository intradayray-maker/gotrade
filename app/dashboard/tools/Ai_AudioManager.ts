// ------------------------------------------------------------
// AI AUDIO MANAGER
// Handles:
// - Background ambient music
// - Fade in/out
// - Voice playback (MP3 alerts)
// - Auto-ducking (music lowers during voice)
// - User volume persistence
// ------------------------------------------------------------

type AudioManagerConfig = {
  musicVolume: number;      // default ambient volume
  duckVolume: number;       // volume during voice playback
  fadeSpeed: number;        // ms per fade step
  musicSrc: string;         // ambient track
};

const DEFAULT_CONFIG: AudioManagerConfig = {
  musicVolume: 0.25,
  duckVolume: 0.05,
  fadeSpeed: 40,
  musicSrc: "/audio/ambient_lowhum.mp3"
};

class AiAudioManager {
  private static instance: AiAudioManager;

  private music: HTMLAudioElement | null = null;
  private voice: HTMLAudioElement | null = null;

  private config: AudioManagerConfig = DEFAULT_CONFIG;
  private isMusicEnabled = false;
  private isVoicePlaying = false;

  // ------------------------------------------------------------
  // SINGLETON
  // ------------------------------------------------------------
  static getInstance() {
    if (!AiAudioManager.instance) {
      AiAudioManager.instance = new AiAudioManager();
    }
    return AiAudioManager.instance;
  }

  // ------------------------------------------------------------
  // INIT MUSIC
  // ------------------------------------------------------------
  initMusic() {
    if (this.music) return;

    this.music = new Audio(this.config.musicSrc);
    this.music.loop = true;
    this.music.volume = 0;
  }

  // ------------------------------------------------------------
  // ENABLE / DISABLE MUSIC
  // ------------------------------------------------------------
  enableMusic() {
    this.initMusic();
    this.isMusicEnabled = true;
    this.fadeTo(this.config.musicVolume);
    this.music?.play();
  }

  disableMusic() {
    this.isMusicEnabled = false;
    this.fadeTo(0);
  }

  // ------------------------------------------------------------
  // FADE LOGIC
  // ------------------------------------------------------------
  private fadeTo(targetVolume: number) {
    if (!this.music) return;

    const step = () => {
      if (!this.music) return;

      const diff = targetVolume - this.music.volume;
      if (Math.abs(diff) < 0.01) {
        this.music.volume = targetVolume;
        return;
      }

      this.music.volume += diff * 0.1;
      setTimeout(step, this.config.fadeSpeed);
    };

    step();
  }

  // ------------------------------------------------------------
  // PLAY VOICE (MP3 ALERT)
  // ------------------------------------------------------------
  async playVoice(src: string) {
    // Stop previous voice
    if (this.voice) {
      this.voice.pause();
      this.voice.currentTime = 0;
    }

    this.voice = new Audio(src);
    this.isVoicePlaying = true;

    // Duck background music
    if (this.isMusicEnabled) {
      this.fadeTo(this.config.duckVolume);
    }

    await this.voice.play();

    this.voice.onended = () => {
      this.isVoicePlaying = false;

      // Restore music volume
      if (this.isMusicEnabled) {
        this.fadeTo(this.config.musicVolume);
      }
    };
  }

  // ------------------------------------------------------------
  // SET USER VOLUME
  // ------------------------------------------------------------
  setMusicVolume(vol: number) {
    this.config.musicVolume = vol;
    if (this.isMusicEnabled) {
      this.fadeTo(vol);
    }
    localStorage.setItem("ai_music_volume", String(vol));
  }

  loadUserVolume() {
    const saved = localStorage.getItem("ai_music_volume");
    if (saved) {
      this.config.musicVolume = Number(saved);
    }
  }
}

export const AudioManager = AiAudioManager.getInstance();
