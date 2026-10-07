import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Esper Studio — Thoughtful websites for what’s next" },
      { name: "theme-color", content: "#eeeae0" },
      {
        name: "description",
        content: "Esper Studio builds thoughtful websites that help ambitious businesses grow online.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Esper Studio — Thoughtful websites for what’s next" },
      {
        property: "og:description",
        content: "A clearer, more human digital presence for businesses ready to grow online.",
      },
      { property: "og:image", content: "https://esper.in/og.svg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
