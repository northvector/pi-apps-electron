export async function getAnnouncements() {
  const response = await fetch(`https://raw.githubusercontent.com/Botspot/pi-apps-announcements/main/message`, { cache: "no-store" });
  return response.text();
}
