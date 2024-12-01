/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access  */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export const loadHaServiceControl = async (): Promise<void> => {
  if (customElements.get("ha-service-control")) {
    return;
  }

  // Load in ha-service-control from developer-tools-service
  const ppResolver = document.createElement("partial-panel-resolver");
  const routes = (ppResolver as any).getRoutes([
    {
      component_name: "developer-tools",
      url_path: "a",
    },
  ]);
  await routes?.routes?.a?.load?.();
  const devToolsRouter = document.createElement("developer-tools-router");
  const devToolsRoutes = (devToolsRouter as any)?.routerOptions?.routes;
  if (devToolsRoutes?.service) {
    await devToolsRoutes?.service?.load?.();
  }
  if (devToolsRoutes?.action) {
    await devToolsRoutes?.action?.load?.();
  }
};
