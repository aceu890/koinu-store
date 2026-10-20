export type SocialNetwork = {
  id: "instagram" | "tiktok" | "facebook";
  label: string;
  href: string;
};

export const INSTAGRAM_URL = "https://www.instagram.com/koinustore_dtf/";
export const INSTAGRAM_HANDLE = "koinustore_dtf";

export const SOCIALS: SocialNetwork[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: INSTAGRAM_URL,
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@koinustore_dtf",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/koinustore_dtf",
  },
];
