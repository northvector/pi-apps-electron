export async function getAppDescription(appname: string) {
  const response = await fetch(`https://raw.githubusercontent.com/Botspot/pi-apps/refs/heads/master/apps/${appname}/description`, { cache: "no-store" });
  return response.text();
}
export async function getAppLogoUrl(appname: string) {
  return `https://raw.githubusercontent.com/Botspot/pi-apps/refs/heads/master/apps/${appname}/icon-64.png`
}
export async function getAppCredits(appname: string) {
  const response = await fetch(`https://raw.githubusercontent.com/Botspot/pi-apps/refs/heads/master/apps/${appname}/credits`, { cache: "no-store" });
  return response.text();
}