import messages from '../../messages/ru.json'

type Messages = typeof messages
type MessageKey = keyof Messages

export function t(key: MessageKey): string {
	return messages[key] ?? key
}
