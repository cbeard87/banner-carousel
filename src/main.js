import Vue from "vue";
import wrap from "@vue/web-component-wrapper";
import BannerCarousel from "./components/BannerCarousel";

const BannerCarouselEl = wrap(Vue, BannerCarousel);

window.customElements.define("banner-carousel", BannerCarouselEl);
