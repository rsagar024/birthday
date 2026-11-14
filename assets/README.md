# Assets: her photos, videos and song

Drop your files into these folders using the **exact filenames** below. No code changes needed.
If a file is missing, the page automatically shows the online placeholder instead, so you can add files gradually.

```
assets/
├── images/   photos + (optional) video posters
├── videos/   short MP4 clips
└── music/    our-song.mp3
```

## Photos (`assets/images/`)

| File | Where it shows |
|---|---|
| `photo-01.jpg` | Carousel slide 1 + polaroid 1 + lightbox: "That rainy evening" |
| `photo-02.jpg` | "Our first trip" |
| `photo-03.jpg` | "The coffee that started it all" |
| `photo-04.jpg` | "Golden hour, golden you" |
| `photo-05.jpg` | "Midnight laughs" |
| `photo-06.jpg` | "Sunday morning softness" |
| `photo-07.jpg` | "Lost in the city with you" |
| `photo-08.jpg` | "Your birthday, last year" |
| `photo-09.jpg` | "The day you said yes" |
| `photo-10.jpg` | "Beach, sunset, us" |
| `photo-11.jpg` | "Silly faces, serious love" |
| `photo-12.jpg` | "Home is wherever you are" |
| `timeline-01.jpg` | Timeline: The day we met |
| `timeline-02.jpg` | Timeline: First coffee together |
| `timeline-03.jpg` | Timeline: Our first trip |
| `timeline-04.jpg` | Timeline: When best friend became love |
| `timeline-05.jpg` | Timeline: Countless midnight calls |
| `timeline-06.jpg` | Timeline: Today, another year of you |

Captions live in `index.html` (search for the `data-caption` attributes and `<figcaption>`s, and the timeline `<h3>`s).

## Videos (`assets/videos/`)

| File | Where it shows | Poster (optional, `assets/images/`) |
|---|---|---|
| `hero.mp4` | Full-screen background behind her name | `poster-hero.jpg` |
| `featured.mp4` | Big featured video in "Little films of us" | `poster-featured.jpg` |
| `memory-01.mp4` | Small card: "Dancing in the kitchen" | `poster-01.jpg` |
| `memory-02.mp4` | Small card: "Our silly road trip" | `poster-02.jpg` |
| `memory-03.mp4` | Small card: "That concert night" | `poster-03.jpg` |

A poster is the still image shown before the video starts, or if the phone blocks autoplay. Grabbing a frame from the clip works well.

## Music (`assets/music/`)

| File | Notes |
|---|---|
| `our-song.mp3` | Plays after she taps "Open the Surprise". It fades in softly and can be paused or muted any time. |

Current track: **"Wholesome" by Kevin MacLeod** ([incompetech.com](https://incompetech.com)), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The license requires the credit line in the site footer. To use your own song instead, replace `our-song.mp3` and remove that footer credit.

## Tips

- **Exact names matter.** Filenames are case-sensitive once the site is hosted online: `Photo-01.JPG` ≠ `photo-01.jpg`.
- **Not a .jpg?** Either convert it, or change the `src` in `index.html` (e.g. `photo-03.png`).
- **Photo shape:** portrait 4:5 (for example 1080×1350) fits best. Other shapes are cropped to fit.
- **Keep it light for her phone:** photos under ~500 KB each (1080px wide is plenty); videos as MP4 (H.264), 5–15 s, under ~10 MB. Videos play muted on loop, so sound isn't needed.
- **iPhone videos (.mov / HEVC)** may not play in every browser. Export or convert them to MP4 (H.264) first.
- iPhone photos in **HEIC** format won't display in most browsers, so convert them to JPG.
