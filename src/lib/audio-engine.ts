/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Howl } from 'howler';

class AudioEngine {
  private sounds: Record<string, Howl> = {};
  private ambient: Howl | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window === 'undefined') return;

    // Load sound effects
    this.sounds = {
      place: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'], volume: 0.5 }),
      move: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], volume: 0.4 }),
      mill: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'], volume: 0.6 }),
      shoot: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'], volume: 0.5 }),
      win: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'], volume: 0.7 }),
      click: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3'], volume: 0.2 }),
    };

    // Load ambient savanna sound
    this.ambient = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3'], // Placeholder for savanna/wind
      loop: true,
      volume: 0.1,
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.ambient?.pause();
    } else {
      this.ambient?.play();
    }
  }

  play(sound: keyof typeof this.sounds) {
    if (this.enabled && this.sounds[sound]) {
      this.sounds[sound].play();
    }
  }

  startAmbient() {
    if (this.enabled) {
      this.ambient?.play();
    }
  }

  stopAmbient() {
    this.ambient?.stop();
  }
}

export const audioEngine = new AudioEngine();
