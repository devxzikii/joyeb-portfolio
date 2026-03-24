declare module 'embla-carousel-react' {
  export type UseEmblaCarouselType = [
    (node: HTMLElement | null) => void,
    {
      canScrollPrev: () => boolean;
      canScrollNext: () => boolean;
      scrollPrev: () => void;
      scrollNext: () => void;
      on: (
        event: string,
        callback: (api: UseEmblaCarouselType[1]) => void,
      ) => void;
      off: (
        event: string,
        callback: (api: UseEmblaCarouselType[1]) => void,
      ) => void;
    } | undefined,
  ];

  export default function useEmblaCarousel(
    options?: Record<string, unknown>,
    plugins?: unknown,
  ): UseEmblaCarouselType;
}
