export async function fetchAppList() {
  const response = await fetch(`https://raw.githubusercontent.com/Botspot/pi-apps/refs/heads/master/etc/categories`, { cache: "no-store" });
  return response.text();
}