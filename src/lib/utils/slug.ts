const CYRILLIC_MAP: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	е: 'e',
	ё: 'yo',
	ж: 'zh',
	з: 'z',
	и: 'i',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'kh',
	ц: 'ts',
	ч: 'ch',
	ш: 'sh',
	щ: 'sch',
	ъ: '',
	ы: 'y',
	ь: '',
	э: 'e',
	ю: 'yu',
	я: 'ya',
}

function transliterate(input: string): string {
	return input
		.split('')
		.map((char) => {
			const lower = char.toLowerCase()
			return CYRILLIC_MAP[lower] ?? char
		})
		.join('')
}

export function generateSlug(input: string): string {
	return transliterate(input)
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/[\s]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export function isValidSlug(slug: string): boolean {
	return /^[a-z0-9-]+$/.test(slug)
}
