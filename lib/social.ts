export type SocialNetwork = {
  id: "instagram" | "tiktok" | "facebook";
  label: string;
  href: string;
};

export const SOCIALS: SocialNetwork[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/koinustore_dtf/",
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
