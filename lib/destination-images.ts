const pexelsImageBySlug: Record<string, string> = {
  "everest-base-camp":
    "https://images.pexels.com/photos/11412192/pexels-photo-11412192.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "annapurna-base-camp":
    "https://images.pexels.com/photos/35012769/pexels-photo-35012769.jpeg?auto=compress&cs=tinysrgb&w=1200",
  pokhara:
    "https://images.pexels.com/photos/30495788/pexels-photo-30495788.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "chitwan-national-park":
    "https://images.pexels.com/photos/36096444/pexels-photo-36096444.jpeg?auto=compress&cs=tinysrgb&w=1200",
  bandipur:
    "https://images.pexels.com/photos/33974456/pexels-photo-33974456.jpeg?auto=compress&cs=tinysrgb&w=1200",
  lumbini:
    "https://images.pexels.com/photos/24018491/pexels-photo-24018491.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "pashupatinath-temple":
    "https://images.pexels.com/photos/16767042/pexels-photo-16767042.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "upper-mustang":
    "https://images.pexels.com/photos/35012769/pexels-photo-35012769.jpeg?auto=compress&cs=tinysrgb&w=1200",
  manang:
    "https://images.pexels.com/photos/35012769/pexels-photo-35012769.jpeg?auto=compress&cs=tinysrgb&w=1200",
  muktinath:
    "https://images.pexels.com/photos/24018491/pexels-photo-24018491.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "rara-lake":
    "https://images.pexels.com/photos/14989384/pexels-photo-14989384.jpeg?auto=compress&cs=tinysrgb&w=1200",
  nagarkot:
    "https://images.pexels.com/photos/24018491/pexels-photo-24018491.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export const homeHeroImage =
  "https://images.pexels.com/photos/30495788/pexels-photo-30495788.jpeg?auto=compress&cs=tinysrgb&w=1800";

export function getDestinationImage(slug: string, imageUrls: string[] = []) {
  const uploadedImage = imageUrls.find((imageUrl) => imageUrl.startsWith("http"));

  return (
    uploadedImage ??
    pexelsImageBySlug[slug] ??
    "https://images.pexels.com/photos/21716009/pexels-photo-21716009.jpeg?auto=compress&cs=tinysrgb&w=1200"
  );
}
