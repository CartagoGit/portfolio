/** Returns a copy shuffled with Fisher-Yates, without mutating the source. */
export function shuffleValues<T>(values: readonly T[], random = Math.random): T[] {
	const shuffled = [...values];
	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const other = Math.floor(random() * (index + 1));
		const current = shuffled[index];
		const replacement = shuffled[other];
		if (current === undefined || replacement === undefined) continue;
		shuffled[index] = replacement;
		shuffled[other] = current;
	}
	return shuffled;
}
