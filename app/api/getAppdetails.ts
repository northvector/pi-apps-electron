
export async function getAppLogoUrl(appname: string) {
  appname = decodeURIComponent(appname);
  return `local:///apps/${appname}/icon-64.png`;
}

export async function getAppCredits(appname: string) {
  const response = await fetch(`https://raw.githubusercontent.com/Botspot/pi-apps/refs/heads/master/apps/${appname}/credits`, { cache: "no-store" });
  return response.text();
}
