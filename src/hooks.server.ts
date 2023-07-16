import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
    let theme: string | null = null;

    const newTheme = event.url.searchParams.get("theme");
    const cookieTheme = event.cookies.get("colortheme");

    if (newTheme) {
        theme = newTheme;
    } else if (cookieTheme) {
        theme = cookieTheme;
    }

    if (theme) {
        return await resolve(event, {
            transformPageChunk: ({ html }) => {
                html = html.replace('data-theme=""', `data-theme="${theme}"`);
                if (theme === 'dark') {
                    if (html.includes('<html class="')) {
                        html = html.replace('<html class="', '<html class="dark ');
                    } else {
                        html = html.replace('<html', '<html class="dark"');
                    }
                }
                return html;
            },
        });
    }

    return await resolve(event);
}) satisfies Handle;