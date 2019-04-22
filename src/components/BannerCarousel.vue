<template>
  <div class="banner-carousel" v-touch:swipe.left="onSwipeLeft" v-touch:swipe.right="onSwipeRight">
    <image-preloader :images="imageUrls"></image-preloader>
    <transition v-bind:name="transition">
      <banner-carousel-slide
        v-for="(slide, index) in slides"
        v-bind:key="index"
        v-bind:slide="slide"
        v-if="slide === activeSlide"
        v-on:start-carousel="startCarousel"
        v-on:stop-carousel="stopCarousel"
        v-on:toggle-enabled="onToggleEnabled"
      ></banner-carousel-slide>
    </transition>
    <transition name="bc-contentfade">
      <div class="banner-carousel_indicators" v-show="enabled">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="indicator"
          v-bind:class="{ active: slide === activeSlide }"
          v-bind:style="{ color: slide.elementColor }"
          v-on:click="changeSlide(slide, $event)"
        ></div>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue2TouchEvents from "vue2-touch-events";

import ImagePreloader from "./ImagePreloader";
import Slide from "./Slide";

import { Timer } from "../utilities/timer";

const defaultSlides = [
	{
		heading: `STOP BUYING &ldquo;ANALYTICS&rdquo;`,
		description: `IT'S TIME TO INVEST IN ANSWERS.`,
		backgroundImage: `https://assets.teradata.com/Tcom/Images/pages/home/Volvo_Case_Study_1200x480.jpg`,
		buttonText: `Experience Vantage`,
		buttonLink: `#`,
		backgroundColor: `#394951`,
		elementColor: `#F37440`,
		videoText: `Watch now`,
		videoId: `5845033029001`
	},
	{
		heading: `Lorem Ipsum is not random text`,
		description: `It’s been the industry standard dummy text for printing and typesetting since the 1500s.`,
		backgroundImage: `https://assets.teradata.com/Tcom/Images/pages/home/homepage_siemens_case_study_1200x480.jpg`,
		buttonText: `View Report`,
		buttonLink: `#`,
		backgroundColor: `#0099C9`,
		elementColor: `#F37440`,
		videoText: ``,
		videoId: ``
	},
	{
		heading: `Lorem Ipsum is not random text`,
		description: `It’s been the industry standard dummy text for printing and typesetting since the 1500s.`,
		backgroundImage: `https://assets.teradata.com/Tcom/Images/pages/home/LarryHMiller_Case_Study_2_1200x480.jpg`,
		buttonText: ``,
		buttonLink: ``,
		backgroundColor: `#FFC74E`,
		elementColor: `#0099C9`,
		videoText: `Watch now`,
		videoId: `5845273693001`
	}
];

export default {
  props: {
    data: {
      type: Array,
      default: defaultSlides
    }
  },
  components: {
    "image-preloader": ImagePreloader,
    "banner-carousel-slide": Slide
  },
  directives: {
    Vue2TouchEvents
  },
  data() {
    return {
      slides: [],
      activeSlide: {},
      transition: `bc-slide-left`,
      carouselTimer: null,
      enabled: true
    };
  },
  computed: {
    imageUrls() {
      return this.slides.map(slide => slide.backgroundImage);
    }
    // currentSlide() {
    //   return this.slides.filter(slide => slide === this.activeSlide);
    // }
  },
  created() {
    this.slides = this.data;
    this.activeSlide = this.data[0];
  },
  mounted() {
    this.startCarousel();
  },
  methods: {
    changeSlide(slide, event, transition) {
      // Only calculate transition if not provided
      if (transition) {
        this.transition = transition;
      } else {
        const isNextSlide =
          this.slides.indexOf(this.activeSlide) < this.slides.indexOf(slide);
        isNextSlide
          ? (this.transition = `bc-slide-left`)
          : (this.transition = `bc-slide-right`);
      }

      this.activeSlide = slide;

      // Delay 'carouseling' after user explicity changes slide via interaction
      if (event) {
        this.carouselTimer.reset(7000);
      }
    },
    next(event = undefined) {
      if (this.slides.indexOf(this.activeSlide) === this.slides.length - 1) {
        const firstSlide = this.slides[0];
        this.changeSlide(firstSlide, event, `bc-slide-left`);
      } else {
        const nextSlide = this.slides[
          this.slides.indexOf(this.activeSlide) + 1
        ];
        this.changeSlide(nextSlide, event, `bc-slide-left`);
      }
    },
    previous(event = undefined) {
      if (this.slides.indexOf(this.activeSlide) === 0) {
        const lastSlide = this.slides[this.slides.length - 1];
        this.changeSlide(lastSlide, event, `bc-slide-right`);
      } else {
        const previousSlide = this.slides[
          this.slides.indexOf(this.activeSlide) - 1
        ];
        this.changeSlide(previousSlide, event, `bc-slide-right`);
      }
    },
    onSwipeLeft(event) {
      if (this.enabled) this.next(event);
    },
    onSwipeRight(event) {
      if (this.enabled) this.previous(event);
    },
    onToggleEnabled(value) {
      this.enabled = value;
    },
    startCarousel() {
      if (this.carouselTimer === null) {
        this.carouselTimer = new Timer(this.next, 7000);
      } else {
        this.carouselTimer.start();
      }
    },
    stopCarousel() {
      if (this.carouselTimer) {
        this.carouselTimer.stop();
      }
    }
  }
};
</script>

<style lang="scss">
$colorSlate: #394951;
$colorWhite: #FFFFFF;
$fontBlack: 900;
$fontBook: 400;
$fontBold: 700;
$phoneMax: 700px;
$tabletMax: 1024px;
$paddingLeftRightTablet: 40px;
$paddingLeftRightPhone: 16px;

.banner-carousel {
  position: relative;
  width: 100%;
  height: 550px;
  background-color: $colorSlate;
  overflow-x: hidden;
}

.banner-carousel_slide {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  color: $colorWhite;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  align-items: center;

  .slide-inner {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;
  }

  .slide_content {
    width: 50%;

    h1 {
      font-weight: $fontBlack;
    }

    h1 {
      font-size: 64px;
      line-height: 1;
    }

    p {
      margin-bottom: 30px;
      font-weight: $fontBook;
      font-size: 24px;
      line-height: 1.5;
    }

    .button {
      border-color: transparent;
      color: $colorWhite;
    }
  }

  .slide_videoCta {
    display: inline-flex;
    font-weight: $fontBold;
    align-items: center;
    cursor: pointer;

    svg {
      width: 128px;
      height: 128px;
      margin-right: 20px;
    }
  }

  .slide_videoCta-mobile {
    display: none;
  }

  .bc-video_buttonWrapper {
    position: absolute;
    top: 24px;
    left: 50%;
    width: 1200px;
    transform: translate(-50%, -50%);

    .button {
      position: absolute;
      right: -24px;
    }
  }

  .video-js {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100%;
    height: 100%;
    background-color: $colorSlate;
  }
}

.banner-carousel_indicators {
  position: absolute;
  bottom: 26px;
  left: 0;
  display: flex;
  width: 100%;
  justify-content: center;

  .indicator {
    width: 10px;
    height: 10px;
    margin: 0 7px;
    border-radius: 50%;
    background-color: $colorWhite;
    transition: all 0.25s ease-in-out;
    cursor: pointer;

    &.active {
      background-color: currentColor;
      transform: scale(1.8);
    }
  }
}

// Desktop Small
@media (max-width: 1300px) {
  .banner-carousel_slide {
    .slide-inner {
      width: 960px;
    }
  }
}

// Tablet Landscape
@media (max-width: $tabletMax) {
  .banner-carousel_slide {
    .slide-inner {
      width: 100%;
      padding: 0 $paddingLeftRightTablet;
    }

    .bc-video_buttonWrapper {
      width: 100%;
    }

    .bc-video_buttonWrapper .button {
      right: 24px;
    }
  }
}

// Tablet Portrait
@media (max-width: 800px) {
  .banner-carousel {
    height: 570px;
  }

  .banner-carousel_slide {
    background-position: 40% center;

    .slide-inner {
      text-align: center;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
    }

    .slide-inner .slide_content {
      width: 100%;
    }

    .slide_content h1 {
      font-size: 56px;
    }

    .slide_content p {
      font-size: 20px;
    }

    .slide_videoCta-mobile {
      display: flex;
      margin: 64px auto;
      color: $colorWhite; // Not configurable according to comp.
      font-weight: $fontBook;
      font-size: 20px;
      justify-content: center;
    }

    .slide_videoCta-mobile svg {
      width: 30px;
      height: 30px;
      margin-right: 12px;
    }

    .slide_video {
      display: none;
    }
  }
}

// Phone Landscape
@media (max-width: $phoneMax) {
  .banner-carousel {
    height: 430px;
  }

  .banner-carousel_slide {
    .slide-inner {
      padding: 0 $paddingLeftRightPhone;
    }

    .slide_content h1 {
      font-size: 42px;
    }

    .slide_content p {
      font-size: 16px;
    }

    .slide_content .button {
      width: 100%;
    }

    .slide_videoCta-mobile {
      font-size: 16px;
    }
  }
}

// Phone Portrait
@media (max-width: 500px) {
  .banner-carousel {
    height: 570px;
  }
}

// Transitions

.bc-slide-left {
  &-enter {
    transform: translateX(100%);
  }

  &-leave-to {
    transform: translate(-100%);
  }

  &-enter-to,
  &-leave {
    transform: translate(0);
  }

  &-enter-active,
  &-leave-active {
    transition: transform 0.4s ease-in-out;
  }
}

.bc-slide-right {
  &-enter {
    transform: translateX(-100%);
  }

  &-leave-to {
    transform: translate(100%);
  }

  &-enter-to,
  &-leave {
    transform: translate(0);
  }

  &-enter-active,
  &-leave-active {
    transition: transform 0.4s ease-in-out;
  }
}

.bc-contentfade {
  &-enter,
  &-leave-to {
    opacity: 0;
  }

  &-enter-to,
  &-leave {
    opacity: 1;
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.4s ease-in-out;
  }
}

.bc-videofade {
  &-enter,
  &-leave-to {
    opacity: 0;
  }

  &-enter-to,
  &-leave {
    opacity: 1;
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.4s ease-in-out;
  }
}
</style>

