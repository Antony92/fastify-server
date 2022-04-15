export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return '0 Bytes'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const secondsToElapsedTime = (sec: number) => {
    const seconds = Math.floor(sec)
    const minutes = Math.floor(sec / 60)
    const hours = Math.floor(minutes / 60)
    return {
        seconds: seconds % 60,
        minutes: minutes % 60,
        hours: hours % 60
    }
}