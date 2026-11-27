function luminance(hex: string): number {
	const clean = hex.replace('#', '');
	if (!/^[0-9a-f]{6}$/i.test(clean)) return 0;
	const channels = [clean.slice(0, 2), clean.slice(2, 4), clean.slice(4, 6)]
		.map((channel) => Number.parseInt(channel, 16) / 255)
		.map((channel) =>
			channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
		);
	return (channels[0] ?? 0) * 0.2126 + (channels[1] ?? 0) * 0.7152 + (channels[2] ?? 0) * 0.0722;
}

export function contrastRatio(foreground: string, background: string): number {
	const foregroundLuminance = luminance(foreground);
	const backgroundLuminance = luminance(background);
	const lighter = Math.max(foregroundLuminance, backgroundLuminance);
	const darker = Math.min(foregroundLuminance, backgroundLuminance);
	return (lighter + 0.05) / (darker + 0.05);
}
