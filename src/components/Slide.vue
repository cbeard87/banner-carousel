<template>
  <div
    class="banner-carousel_slide"
    :data-celebrus="slide.celebrus"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :style="{ backgroundImage: formattedBackground }"
  >
    <transition name="bc-contentfade">
      <div class="slide-inner" v-if="!videoPlaying">
        <div class="slide_content">
          <h1 v-html="slide.heading"></h1>
          <p v-html="slide.description"></p>
          <div
            class="slide_videoCta slide_videoCta-mobile"
            v-if="slide.videoText && slide.videoId"
            @click="handlePlayClick"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fill="#FFFFFF"
                d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"
              ></path>
            </svg>
            <span>{{slide.videoText}}</span>
          </div>
          <a
            v-if="slide.buttonLink && slide.buttonText"
            :href="slide.buttonLink"
            :style="{ backgroundColor: slide.elementColor }"
            class="button"
            :data-celebrus="slide.celebrus + ' - Button'"
          >{{slide.buttonText}}</a>
        </div>
        <div class="slide_video">
          <div
            class="slide_videoCta"
            v-if="slide.videoText && slide.videoId"
            @click="handlePlayClick"
            :data-celebrus="slide.celebrus + ' - Play Video'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              :data-celebrus="slide.celebrus + ' - Play Video (svg)'"
            >
              <path
                fill="#FFFFFF"
                :data-celebrus="slide.celebrus + ' - Play Video (path)'"
                d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"
              ></path>
            </svg>
            <span
              :style="{ color: slide.elementColor }"
              :data-celebrus="slide.celebrus + ' - Play Video (text)'"
            >{{slide.videoText}}</span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="bc-videofade">
      <div class="bc-video" v-show="slide.videoId && videoPlaying">
        <div ref="bcVideo"></div>
        <div class="bc-video_buttonWrapper">
          <button @click="onVideoClose" type="button" class="button">Close</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import brightcovePlayerLoader from "@brightcove/player-loader";

import { hexToRgb } from "../utilities/hexToRgb";

export default {
  props: {
    slide: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      videoPlaying: false
    };
  },
  mounted() {
    brightcovePlayerLoader({
      refNode: this.$refs.bcVideo,
      accountId: "1222253929001",
      playerId: "fqQuhv0bx",
      videoId: this.slide.videoId
    });
  },
  computed: {
    formattedBackground() {
      const color = this.slide.backgroundColor
        ? hexToRgb(this.slide.backgroundColor).toString()
        : hexToRgb("#394951").toString();
      const gradient = `linear-gradient(90deg, rgba(${color}, 0.9) 0%, rgba(${color}, 0.5) 100%)`;
      const image = `url('${this.slide.backgroundImage}')`;

      // If bg color not defined, don't show gradient
      return this.slide.backgroundColor ? `${gradient}, ${image}` : `${image}`;
    }
  },
  watch: {
    videoPlaying(newVal) {
      // TODO: Abstract this out into its own method.
      // Difficult due to the adding and removing of specific event listeners.
      this.$nextTick(() => {
        if (newVal) {
          this.$emit("toggle-enabled", false);
          const video = this.$el.querySelector(".vjs-tech");
          video.play();
          video.addEventListener(
            "ended",
            () => {
              this.videoPlaying = false;
              this.$emit("start-carousel");
              this.$emit("toggle-enabled", true);
            },
            { once: true }
          );
        } else {
          this.$emit("toggle-enabled", true);
          const video = this.$el.querySelector(".vjs-tech");
          video.pause();
        }
      });
    }
  },
  methods: {
    handleMouseEnter() {
      if (!this.videoPlaying) {
        this.$emit("stop-carousel");
      }
    },
    handleMouseLeave() {
      if (!this.videoPlaying) {
        this.$emit("start-carousel");
      }
    },
    handlePlayClick() {
      this.videoPlaying = true;
      this.$emit("stop-carousel");
    },
    onVideoClose() {
      this.videoPlaying = false;
      this.$emit("start-carousel");
    }
  }
};
</script>

