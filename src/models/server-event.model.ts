export interface ServerEvent {
    message: string,
    type: 'info' | 'warning' | 'danger'
}