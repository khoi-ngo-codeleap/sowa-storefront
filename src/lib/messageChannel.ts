

declare global {
    interface Window {
        channel: MessageChannel
    }
}

export const getChannelInstance = () => {
    if (typeof window.channel === 'undefined') {
        window.channel = new MessageChannel();
    }
    return window.channel;
}