import localSheetUrl from "../assets/researcher-sheet.png?inline";
import { assetUrl } from "../asset-url";
import { surface, type Painter } from "./paint";

// Four 32×64 frames per row: front, back, left, right. The first column is
// standing; the remaining columns complete the four-frame walking cycle.
export const HERO_W = 32;
export const HERO_H = 64;
export const HERO_DISPLAY_W = 20;
export const HERO_DISPLAY_H = 40;
export type Facing = "down" | "up" | "left" | "right";
export type HeroSheet = Record<Facing, Painter[]>;
const DIRECTIONS: Facing[] = ["down", "up", "left", "right"];
let sheet: HeroSheet | null = null;
let pending: Promise<void> | null = null;

const sheetUrl = import.meta.env.VITE_LOCAL_ASSETS === "1" ? localSheetUrl : assetUrl("researcher-sheet.png");

/** Load the official CDN atlas, or an embedded PNG for offline review. */
export function prepareHero(): Promise<void> {
  if (sheet) return Promise.resolve();
  if (pending) return pending;
  pending = new Promise<void>((resolve, reject) => {
    const image = new Image();
    if (sheetUrl.startsWith("https://")) image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        if (image.naturalWidth !== HERO_W * 4 || image.naturalHeight !== HERO_H * 4) {
          throw new Error("The researcher sheet must be 128×256 pixels");
        }
        const frames = {} as HeroSheet;
        DIRECTIONS.forEach((direction, row) => {
          frames[direction] = Array.from({ length: 4 }, (_, col) => {
            const frame = surface(HERO_W, HERO_H);
            frame.ctx.drawImage(image, col * HERO_W, row * HERO_H, HERO_W, HERO_H, 0, 0, HERO_W, HERO_H);
            return frame;
          });
        });
        sheet = frames;
        resolve();
      } catch (error) { reject(error); }
    };
    image.onerror = () => reject(new Error("The researcher sprite could not load"));
    image.src = sheetUrl;
  }).catch((error: unknown) => {
    pending = null;
    throw error;
  });
  return pending;
}

export function getHeroSheet(): HeroSheet {
  if (!sheet) throw new Error("Prepare the researcher sheet before rendering the world");
  return sheet;
}
