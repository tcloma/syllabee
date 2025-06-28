// utils/hotServer.ts
type Handler = Parameters<typeof Bun.serve>[0];
const HMR_KEY = "__hmr_server__";

export function createHotServer(handler: Handler) {
	const g = globalThis as typeof globalThis & {
		[HMR_KEY]?: ReturnType<typeof Bun.serve>;
	};

	if (import.meta.hot) {
		import.meta.hot.accept((mod) => {
			g[HMR_KEY]?.stop?.();
			const h = mod?.default;
			if (h && typeof h.fetch === "function") {
				g[HMR_KEY] = Bun.serve(h);
				console.debug(
					`🔁 HMR: Server reloaded on ${g[HMR_KEY].hostname}:${g[HMR_KEY].port}`,
				);
			}
		});
	} else {
		g[HMR_KEY] = Bun.serve(handler);
		console.log(
			`🚀✨ Syllaby API Server is live!\n\n🌐 URL:        http://localhost:${g[HMR_KEY].port}\n📡 Status:     Listening for incoming requests...\n🧠 Mode:       Development (HMR Enabled)`,
		);
	}
}
